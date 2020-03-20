import { WebAPICallResult, WebClient } from '@slack/web-api';
import { EventEmitter } from 'vscode';
import { SECOND_MS } from '../../constants';
import { getSlackAPI } from '../../slack/api';

export type TUserPresenceStatus = 'active' | 'away' | 'unknown';

interface IPresenceResponse extends WebAPICallResult {
    presence?: TUserPresenceStatus;
}

interface IUserPresenceStatus {
    userId: string;
    status: TUserPresenceStatus;
}

interface IUserPresenceRecord extends IUserPresenceStatus {
    timestamp: number;
    accountName: string;
}

export class SlackUserStatusRepository {
    private slackApiMap = new Map<string, WebClient>();
    private userStatusesMap = new Map<string, IUserPresenceRecord>();
    private userStatusRequestsMap = new Map<
        string,
        Promise<IUserPresenceStatus>
    >();
    private eventsEmitter = new EventEmitter<IUserPresenceStatus>();
    public onUserStatus = this.eventsEmitter.event;

    private getApi = async (accountName: string): Promise<WebClient> => {
        const currentApi = this.slackApiMap.get(accountName);
        if (currentApi) {
            return currentApi;
        }

        const api = await getSlackAPI(accountName);

        if (!api) {
            throw new Error(
                `Cannot get Slack API for account "${accountName}".`
            );
        }

        return api;
    };

    public getUserStatus = async (userId: string, accountName: string) => {
        const existingRecord = this.userStatusesMap.get(userId);
        if (existingRecord) {
            const delta = Date.now() - existingRecord.timestamp;
            // if a recent status present, don't ask for a new one
            if (delta <= 10 * SECOND_MS) {
                return;
            }
        }

        const currentRequest = this.userStatusRequestsMap.get(userId);
        if (currentRequest) {
            try {
                const status = await currentRequest;
                return this.emitUserStatus(status, accountName);
            } finally {
                this.userStatusRequestsMap.delete(userId);
            }
        }

        try {
            const request = this.requestUserStatus(userId, accountName);
            this.userStatusRequestsMap.set(userId, request);
            const status = await request;
            this.emitUserStatus(status, accountName);
        } finally {
            this.userStatusRequestsMap.delete(userId);
        }
    };

    private requestUserStatus = async (userId: string, accountName: string) => {
        const api = await this.getApi(accountName);

        const presenceResponse: IPresenceResponse = await api.users.getPresence(
            {
                user: userId,
            }
        );

        if (!presenceResponse || !presenceResponse.presence) {
            const currentUserStatus = this.userStatusesMap.get(userId);
            if (currentUserStatus) {
                return currentUserStatus;
            }

            const status: IUserPresenceStatus = {
                userId,
                status: 'unknown',
            };

            return status;
        }

        const status: IUserPresenceStatus = {
            userId,
            status: presenceResponse.presence,
        };

        return status;
    };

    private emitUserStatus = (
        status: IUserPresenceStatus,
        accountName: string
    ) => {
        const { userId } = status;
        const currentUserStatus = this.userStatusesMap.get(userId);

        this.userStatusesMap.set(userId, {
            ...status,
            accountName,
            timestamp: Date.now(),
        });

        if (!currentUserStatus) {
            return this.eventsEmitter.fire(status);
        }

        if (currentUserStatus.status === status.status) {
            return;
        }

        return this.eventsEmitter.fire(status);
    };

    public getCachedStatus = (userId: string): IUserPresenceStatus => {
        const existingRecord = this.userStatusesMap.get(userId);
        if (existingRecord) {
            const delta = Date.now() - existingRecord.timestamp;
            // if a recent status present, don't ask for a new one
            if (delta <= 2 * SECOND_MS) {
                return {
                    userId: existingRecord.userId,
                    status: existingRecord.status,
                };
            }
        }

        return {
            userId,
            status: 'unknown',
        };
    };

    public refreshStatuses = async () => {
        const records = this.userStatusesMap.values();

        let result = [];
        for (let record of records) {
            const { userId, accountName } = record;
            result.push(this.getUserStatus(userId, accountName));
        }

        await Promise.all(result);
    };
}

export const slackUserStatusRepository = new SlackUserStatusRepository();
