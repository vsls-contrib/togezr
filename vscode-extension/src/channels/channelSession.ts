import { WebClient } from '@slack/web-api';
import * as vsls from 'vsls';
import { onCommitPushToRemote } from '../branchBroadcast/git/onCommit';
import { TSlackChannel } from '../commands/shareIntoAccountCommand/shareIntoAccountCommand';
import { renderSlackComment } from '../renderers/slack/renderSlackComment';
import {
    ISessionEvent,
    ISessionStartEvent,
} from '../sessionConnectors/renderer/events';
import { getSlackAPI } from '../slack/api';

export type TChannel = TSlackChannel;

export class ChannelSession {
    public readonly events: ISessionEvent[] = [];

    public isDisposed: boolean = false;

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
    }

    public init = async () => {
        const { session } = this.vslsAPI;
        if (!session.id || !session.user) {
            throw new Error('No LiveShare session found.');
        }

        this.onEvent({
            type: 'start-session',
            sessionId: session.id,
            user: session.user,
            timestamp: Date.now(),
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
    };

    public async onEvent(e: ISessionEvent) {
        this.events.push({
            ...e,
        });
    }
}

export class SlackChannelSession extends ChannelSession {
    private slackAPI: WebClient | null = null;

    get api() {
        if (!this.slackAPI) {
            throw new Error('Call "initSlackAPI" first.');
        }

        return this.slackAPI;
    }

    private ensureSlackAPI = async () => {
        if (this.slackAPI) {
            return;
        }

        this.slackAPI = await getSlackAPI(this.channel.account.name);
    };

    public async onEvent(e: ISessionEvent) {
        await super.onEvent(e);

        const comment = await renderSlackComment(this.events, this.channel);

        await this.updateSlackComment(comment);
    }

    private updateSlackComment = async (
        commentBody: any[],
        thread_ts?: string
    ) => {
        await this.ensureSlackAPI();

        if (this.channel.type === 'slack-user') {
            const { user } = this.channel;
            const startSession = this.events[0] as ISessionStartEvent;

            const result = await this.api.chat.postMessage({
                channel: user.im.id,
                text: `${startSession.user.displayName} started Live Share session`,
                blocks: commentBody,
                thread_ts,
                mrkdwn: true,
            });

            console.log(result);
        }
    };
}
