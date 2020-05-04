import { emojiForEvent } from '../emoji/eventToEmojiMap';
import {
    ISessionCommitPushEvent,
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from '../sessionConnectors/renderer/events';
import { User } from '../user';
import { getCleanCommitMessage } from '../utils/getCleanCommitMessage';
import { getGuests } from '../utils/getGuests';
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
export const renderEventReplyTeams = async (
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
