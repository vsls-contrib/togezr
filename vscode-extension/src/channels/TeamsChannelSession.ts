import { randomBytes } from 'crypto';
import * as vsls from 'vsls';
import { emojiForEvent } from '../emoji/eventToEmojiMap';
import { ITeamsAccountRecord } from '../interfaces/IAccountRecord';
import { ITeamsChannelChannel } from '../interfaces/ITeamsChannelChannel';
import { TTeamsChannel } from '../interfaces/TTeamsChannel';
import { renderCommentTeams } from '../renderers/teams/renderCommentTeams';
import {
    ISessionCommitPushEvent,
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from '../sessionConnectors/renderer/events';
import { TeamsAPI } from '../teams/teamsAPI';
import { User } from '../user';
import { getCleanCommitMessage } from '../utils/getCleanCommitMessage';
import { getGuests } from '../utils/getGuests';
import { ChannelSession, IChannelMementoRecord } from './ChannelSession';

// const renderUser = (event: ISessionUserJoinEvent) => {
//     const { user } = event;
//     const ghLink = `<a href="https://github.com/${user.userName}">${user.displayName}</a>`;

//     return ghLink;
// };

const renderGuestJoinEventReplyTeams = async (event: ISessionUserJoinEvent) => {
    const user = new User(event.user);

    return {
        subject: null,
        body: {
            contentType: 'html',
            content: `${emojiForEvent(
                event
            )} ${user.getHtmlUserLink()} joined.`,
        },
    };
};

const renderRestartSessionEventReplyTeams = async (
    event: ISessionStartEvent
) => {
    return {
        subject: null,
        body: {
            contentType: 'html',
            content: `${emojiForEvent(event)} session restarted.`,
        },
    };
};

const renderPushCommitEventReplyTeams = async (
    event: ISessionCommitPushEvent,
    events: ISessionEvent[]
) => {
    const guests = getGuests(events);
    const cleanCommitMessage = getCleanCommitMessage(event.commit.message);

    const guestsNamesWithLink = guests
        .map((guest) => {
            const user = new User(guest.user);
            return `${user.getHtmlUserLink()}`;
        })
        .join(', ');

    return {
        subject: null,
        body: {
            contentType: 'html',
            content: `${emojiForEvent(
                event
            )} ${guestsNamesWithLink} pushed 1 commit: <a href="${
                event.repoUrl
            }/commit/${event.commit.hash}">${cleanCommitMessage}</a>.`,
        },
    };
};

const renderEventReplyTeams = async (
    event: ISessionEvent,
    events: ISessionEvent[]
) => {
    if (event.type === 'guest-join') {
        return renderGuestJoinEventReplyTeams(event);
    }

    if (event.type === 'restart-session') {
        return renderRestartSessionEventReplyTeams(event);
    }

    if (event.type === 'commit-push') {
        return renderPushCommitEventReplyTeams(event, events);
    }

    throw new Error(`Unknown event ${event.type}.`);
};

export class TeamsChannelSession extends ChannelSession {
    private messageId?: string;

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
            const comment = await renderCommentTeams(
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

        await this.addTeamsReplyOnComment(e, this.events);
    }

    private updateTeamsComment = async (commentBody: {
        [key: string]: any;
    }) => {
        if (this.messageId) {
            return;
        }

        const api = new TeamsAPI(this.channel.account as ITeamsAccountRecord);

        const teamsChannel = this.channel as ITeamsChannelChannel;
        const { team, channel } = teamsChannel;
        const attachmentId = randomBytes(16).toString('base64');

        const template = {
            subject: null,
            body: {
                contentType: 'html',
                content: `<attachment id="${attachmentId}"></attachment>`,
            },
            attachments: [
                {
                    id: `${attachmentId}`,
                    contentUrl: null,

                    contentType: 'application/vnd.microsoft.card.adaptive',
                    content: JSON.stringify(commentBody),
                    name: null,
                    thumbnailUrl: null,
                },
            ],
        };

        const result = await api.sendChannelMessage(
            team.id,
            channel.id,
            JSON.stringify(template, null, 2)
        );

        this.messageId = result.id;
    };

    private addTeamsReplyOnComment = async (
        event: ISessionEvent,
        events: ISessionEvent[]
    ) => {
        const api = new TeamsAPI(this.channel.account as ITeamsAccountRecord);

        // do not render session start event
        if (event.type === 'start-session') {
            return;
        }

        if (!this.messageId) {
            throw new Error('Send the message first.');
        }

        const teamsChannel = this.channel as ITeamsChannelChannel;
        const { team, channel } = teamsChannel;

        const reply = await renderEventReplyTeams(event, events);
        await api.addChannelMessageReply(
            team.id,
            channel.id,
            this.messageId,
            JSON.stringify(reply)
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

        const { messageId } = data;
        if (typeof messageId !== 'string') {
            this.deleteExistingRecord();
            return null;
        }

        this.messageId = messageId;

        return record;
    }

    public onPersistData = (record: IChannelMementoRecord) => {
        if (!this.messageId) {
            return record;
        }

        return {
            ...record,
            data: {
                messageId: this.messageId,
            },
        };
    };
}
