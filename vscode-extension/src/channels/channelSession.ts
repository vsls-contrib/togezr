import * as vscode from 'vscode';
import * as vsls from 'vsls';
import { onCommitPushToRemote } from '../branchBroadcast/git/onCommit';
import { MINUTE_MS } from '../constants';
import { TChannel } from '../interfaces/TChannel';
import * as memento from '../memento';
import { ISessionEvent } from '../sessionConnectors/renderer/events';

const HEARTBEAT_INTERVAL = 1000;
const CHANNEL_SESSION_PREFIX = 'togezr.channel.session';

type TPrimitive = string | number | boolean;

export interface IChannelMementoRecord {
    timestamp: number;
    events: ISessionEvent[];
    sessionId?: string;
    data?: { [key: string]: TPrimitive };
}

const userPlaceholder = {
    displayName: 'Oleg Solomka',
    userName: 'legomushroom',
    emailAddress: 'legomushroom@gmail.com',
    id: 'olsolomk',
};

export class ChannelSession {
    public events: ISessionEvent[] = [];

    public sessionId?: string;

    public isDisposed: boolean = false;

    private heartbeatInterval: NodeJS.Timer | undefined;

    private id: string;

    private mementoRecordExpirationThreshold: number = 3 * MINUTE_MS;

    private getMementoId = () => {
        switch (this.channel.type) {
            case 'slack-user': {
                return this.channel.user.im.id;
            }

            case 'slack-channel': {
                return this.channel.channel.id;
            }

            case 'github-issue': {
                return this.channel.issue.html_url;
            }

            default: {
                throw new Error(
                    `Unknown channel session type ${(this.channel as any).type}`
                );
            }
        }
    };

    constructor(
        public channel: TChannel,
        public siblingChannels: ChannelSession[],
        public vslsAPI: vsls.LiveShare
    ) {
        const { account, type } = this.channel;
        if (!account) {
            throw new Error(
                `No account found for the channel "${channel.type}".`
            );
        }

        const { token } = account;
        if (!token) {
            throw new Error(
                `No token found for the account "${account.name}".`
            );
        }

        const path = vscode.workspace.rootPath;
        if (!path) {
            throw new Error('Cannot get workspace path.');
        }

        const suffix = this.getMementoId();
        this.id = `${CHANNEL_SESSION_PREFIX}.${type}.${account.name}.${suffix}`;

        this.readExistingRecord();
    }

    public readExistingRecord() {
        if (!this.id) {
            throw new Error('Calculate channel session id first.');
        }

        const record = memento.get<IChannelMementoRecord | undefined>(this.id);
        if (!record) {
            return null;
        }

        const delta = Date.now() - record.timestamp;
        if (delta >= this.mementoRecordExpirationThreshold) {
            this.deleteExistingRecord();
            return null;
        }

        this.events = record.events;
        this.sessionId = record.sessionId;

        return record;
    }

    public deleteExistingRecord = () => {
        memento.remove(this.id);
    };

    public init = async () => {
        const { session } = this.vslsAPI;
        if (!session.id) {
            throw new Error('No LiveShare session found.');
        }

        this.sessionId = session.id;

        const startEventType = this.events.length
            ? 'restart-session'
            : 'start-session';

        // TODO: for some reason LS does not give the user id anymore
        const user = session.user || userPlaceholder;

        this.onEvent({
            type: startEventType,
            sessionId: session.id,
            user,
            timestamp: Date.now(),
        });

        this.vslsAPI.onDidChangeSession(async (e: vsls.SessionChangeEvent) => {
            if (!e.session.id) {
                this.onEvent({
                    type: 'end-session',
                    timestamp: Date.now(),
                });

                await this.dispose();
                return;
            }
        });

        this.vslsAPI.onDidChangePeers(async (e: vsls.PeersChangeEvent) => {
            if (this.isDisposed) {
                return;
            }

            if (e.removed.length) {
                return;
            }

            const userAdded = e.added[0];
            const { user } = userAdded;

            // TODO LS stopped returning the user object
            // if (!user || !user.id) {
            //     throw new Error('User not found or joined without id.');
            // }

            await this.onEvent({
                type: 'guest-join',
                user: user || userPlaceholder,
                timestamp: Date.now(),
            });
        });

        onCommitPushToRemote(async ([commit, repoUrl]) => {
            if (this.isDisposed) {
                return;
            }

            await this.onEvent({
                type: 'commit-push',
                commit,
                repoUrl,
                timestamp: Date.now(),
            });
        });

        this.heartbeatInterval = setInterval(
            this.persistData,
            HEARTBEAT_INTERVAL
        );
    };

    public async onEvent(e: ISessionEvent) {
        /**
         * Don't add user join event twice.
         */
        if (e.type === 'guest-join') {
            const existingEvent = this.events.find((event) => {
                if (event.type !== 'guest-join') {
                    return false;
                }

                return event.user.id === e.user.id;
            });

            if (existingEvent) {
                return;
            }
        }

        this.events.push({ ...e });
        this.persistData();
    }

    public onPersistData = (record: IChannelMementoRecord) => {
        return record;
    };

    public persistData = () => {
        const record: IChannelMementoRecord = {
            timestamp: Date.now(),
            events: this.events,
            sessionId: this.sessionId,
        };

        const pipedRecord = this.onPersistData(record);
        memento.set(this.id, pipedRecord);
    };

    public dispose = async () => {
        this.isDisposed = true;

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    };
}
