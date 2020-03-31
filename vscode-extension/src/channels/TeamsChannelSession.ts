import * as vsls from 'vsls';
import { ITeamsAccountRecord } from '../interfaces/IAccountRecord';
import { ITeamsChannelChannel } from '../interfaces/ITeamsChannelChannel';
import { TTeamsChannel } from '../interfaces/TTeamsChannel';
import { renderTeamsComment } from '../renderers/teams/renderTeamsComment';
import { ISessionEvent } from '../sessionConnectors/renderer/events';
import { TeamsAPI } from '../teams/teamsAPI';
import { ChannelSession } from './ChannelSession';

export class TeamsChannelSession extends ChannelSession {
    // private messageTs?: string;

    constructor(
        public channel: TTeamsChannel,
        public siblingChannels: ChannelSession[],
        public vslsAPI: vsls.LiveShare
    ) {
        super(channel, siblingChannels, vslsAPI);
    }

    public async onEvent(e: ISessionEvent) {
        await super.onEvent(e);

        if (e.type !== 'commit-push') {
            const comment = await renderTeamsComment(
                this.events,
                this.channel,
                this.siblingChannels
            );
            await this.updateTeamsComment(comment);
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

        // await this.addSlackReplyOnComment(e);
    }

    private updateTeamsComment = async (commentBody: {
        [key: string]: any;
    }) => {
        const api = new TeamsAPI(this.channel.account as ITeamsAccountRecord);

        const teamsChannel = this.channel as ITeamsChannelChannel;

        const { team, channel } = teamsChannel;

        const result = await api.sendChannelMessage(
            team.id,
            channel.id,
            JSON.stringify(commentBody, null, 4)
        );

        console.log(result);

        // const channelId = this.getChannelId();

        // const startSession = this.events[0] as ISessionStartEvent;
        // const message = {
        //     channel: channelId,
        //     text: `${startSession.user.displayName} started Live Share session`,
        //     blocks: commentBody,
        //     mrkdwn: true,
        // };

        // const result = this.messageTs
        //     ? await api.chat.update({ ...message, ts: this.messageTs })
        //     : await api.chat.postMessage(message);

        // if (!result.ok) {
        //     throw new Error('Cannot update Slack comment.');
        // }
        // const ts = result.ts as string | undefined;
        // this.messageTs = this.messageTs || ts;
    };

    // private addSlackReplyOnComment = async (event: ISessionEvent) => {
    //     const api = await getSlackAPI(this.channel.account.name);

    //     // do not render session start event
    //     if (event.type === 'start-session') {
    //         return;
    //     }

    //     if (!this.messageTs) {
    //         throw new Error('Send the message first.');
    //     }

    //     const message = await renderSlackEventReply(event, this.events);
    //     const result = await api.chat.postMessage({
    //         channel: this.getChannelId(),
    //         ...message,
    //         mrkdwn: true,
    //         thread_ts: this.messageTs,
    //     });

    //     if (!result.ok) {
    //         throw new Error(
    //             `Could not post Slack comment reply for the session event "${event.type}"`
    //         );
    //     }
    // };

    // private getChannelId = () => {
    //     if (this.channel.type === 'slack-user') {
    //         return this.channel.user.im.id;
    //     }

    //     if (this.channel.type === 'slack-channel') {
    //         return this.channel.channel.id;
    //     }

    //     throw new Error(
    //         `Unknown channel type "${(this.channel as any).type}".`
    //     );
    // };

    // public readExistingRecord() {
    //     const record = super.readExistingRecord();
    //     if (!record) {
    //         return null;
    //     }

    //     const { data } = record;
    //     if (!data) {
    //         return null;
    //     }

    //     const { ts } = data;
    //     if (typeof ts !== 'string') {
    //         this.deleteExistingRecord();
    //         return null;
    //     }

    //     this.messageTs = ts;

    //     return record;
    // }

    // public onPersistData = (record: IChannelMementoRecord) => {
    //     if (!this.messageTs) {
    //         return record;
    //     }

    //     return {
    //         ...record,
    //         data: {
    //             ts: this.messageTs,
    //         },
    //     };
    // };
}
