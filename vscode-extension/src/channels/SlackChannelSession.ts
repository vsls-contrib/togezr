import { WebClient } from '@slack/web-api';
import { renderSlackComment } from '../renderers/slack/renderSlackComment';
import { renderSlackEventReply } from '../renderers/slack/renderSlackEventReply';
import {
    ISessionEvent,
    ISessionStartEvent,
} from '../sessionConnectors/renderer/events';
import { getSlackAPI } from '../slack/api';
import { ChannelSession, IChannelMementoRecord } from './ChannelSession';

export class SlackChannelSession extends ChannelSession {
    private slackAPI: WebClient | null = null;
    private messageTs?: string;

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
        await this.ensureSlackAPI();

        if (e.type !== 'commit-push') {
            const comment = await renderSlackComment(this.events, this.channel);
            await this.updateSlackComment(comment);
        }

        /**
         * Don't add comment for end session, this should be
         * responsibility of the services after some time of
         * inactivity since the user can restart the session.
         */
        //
        if (e.type === 'end-session') {
            return;
        }

        await this.addSlackReplyOnComment(e);
    }

    private updateSlackComment = async (commentBody: any[]) => {
        const channelId = this.getChannelId();

        const startSession = this.events[0] as ISessionStartEvent;
        const message = {
            channel: channelId,
            text: `${startSession.user.displayName} started Live Share session`,
            blocks: commentBody,
            mrkdwn: true,
        };

        const result = this.messageTs
            ? await this.api.chat.update({ ...message, ts: this.messageTs })
            : await this.api.chat.postMessage(message);

        if (!result.ok) {
            throw new Error('Cannot update Slack comment.');
        }
        const ts = result.ts as string | undefined;
        this.messageTs = this.messageTs || ts;
    };

    private addSlackReplyOnComment = async (event: ISessionEvent) => {
        // do not render session start event
        if (event.type === 'start-session') {
            return;
        }

        if (!this.messageTs) {
            throw new Error('Send the message first.');
        }

        const message = await renderSlackEventReply(event, this.events);
        const result = await this.api.chat.postMessage({
            channel: this.getChannelId(),
            ...message,
            mrkdwn: true,
            thread_ts: this.messageTs,
        });

        if (!result.ok) {
            throw new Error(
                `Could not post Slack comment reply for the session event "${event.type}"`
            );
        }
    };

    private getChannelId = () => {
        if (this.channel.type === 'slack-user') {
            return this.channel.user.im.id;
        }

        if (this.channel.type === 'slack-channel') {
            return this.channel.channel.id;
        }

        throw new Error(
            `Unknown channel type "${(this.channel as any).type}".`
        );
    };

    public readExistingRecord() {
        const record = super.readExistingRecord();
        if (!record) {
            return null;
        }

        const { data } = record;
        if (!data) {
            return null;
        }

        const { ts } = data;
        if (typeof ts !== 'string') {
            this.deleteExistingRecord();
            return null;
        }

        this.messageTs = ts;

        return record;
    }

    public onPersistData = (record: IChannelMementoRecord) => {
        if (!this.messageTs) {
            return record;
        }

        return {
            ...record,
            data: {
                ts: this.messageTs,
            },
        };
    };
}
