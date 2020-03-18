import * as vscode from 'vscode';
import * as vsls from 'vsls';
import { onCommitPushToRemote } from '../branchBroadcast/git/onCommit';
import { MINUTE_MS } from '../constants';
import { TChannel } from '../interfaces/TChannel';
import * as memento from '../memento';
import { ISessionEvent } from '../sessionConnectors/renderer/events';
import { hashString } from '../utils/hashString';

const HEARTBEAT_INTERVAL = 1000;
const CHANNEL_SESSION_PREFIX = 'togezr.channel.session';

type TPrimitive = string | number | boolean;

export interface IChannelMementoRecord {
    timestamp: number;
    events: ISessionEvent[];
    data?: { [key: string]: TPrimitive };
}

export class ChannelSession {
    public events: ISessionEvent[] = [];

    public isDisposed: boolean = false;

    private heartbeatInterval: NodeJS.Timer | undefined;

    private id: string;

    private mementoRecordExpirationThreshold: number = 3 * MINUTE_MS;

    constructor(
        public channel: TChannel,
        public siblingChannels: ChannelSession[],
        public vslsAPI: vsls.LiveShare
    ) {
        const { account } = this.channel;
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

        const hashedPath = hashString(path);
        this.id = `${CHANNEL_SESSION_PREFIX}.${hashedPath}`;

        this.readExistingRecord();
    }

    public readExistingRecord = () => {
        if (!this.id) {
            throw new Error('Calculate channel session id first.');
        }

        const record = memento.get<IChannelMementoRecord | undefined>(this.id);
        if (!record) {
            return null;
        }

        const delta = Date.now() - record.timestamp;
        if (delta >= this.mementoRecordExpirationThreshold) {
            memento.remove(this.id);
            return null;
        }

        this.events = record.events;

        return record;
    };

    public init = async () => {
        const { session } = this.vslsAPI;
        if (!session.id || !session.user) {
            throw new Error('No LiveShare session found.');
        }

        const startEventType = this.events.length
            ? 'restart-session'
            : 'start-session';

        this.onEvent({
            type: startEventType,
            sessionId: session.id,
            user: session.user,
            timestamp: Date.now(),
        });

        this.vslsAPI.onDidChangeSession(async (e: vsls.SessionChangeEvent) => {
            if (!e.session.id) {
                this.onEvent({
                    type: 'end-session',
                    timestamp: Date.now(),
                });

                await this.dispose();
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

            if (!user || !user.id) {
                throw new Error('User not found or joined without id.');
            }

            await this.onEvent({
                type: 'guest-join',
                user,
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
