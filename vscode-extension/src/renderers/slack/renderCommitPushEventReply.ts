import { DEFAULT_GITHUB_AVATAR } from '../../sessionConnectors/constants';
import { githubAvatarRepository } from '../../sessionConnectors/github/githubAvatarsRepository';
import {
    ISessionCommitPushEvent,
    ISessionEvent,
} from '../../sessionConnectors/renderer/events';
import { User } from '../../user';
import { getCleanCommitMessage } from '../../utils/getCleanCommitMessage';
import { getGuests } from '../../utils/getGuests';

export const renderCommitPushEventReply = async (
    event: ISessionCommitPushEvent,
    events: ISessionEvent[]
) => {
    const guests = getGuests(events);
    const guestsNames = guests
        .map((guest) => {
            return guest.user.displayName;
        })
        .join(', ');

    const guestsNamesWithLink = guests
        .map((guest) => {
            const user = new User(guest.user);
            return `${user.getSlackUserLink()}`;
        })
        .join(', ');

    const cleanCommitMessage = getCleanCommitMessage(event.commit.message);
    const guestsAvatars = await Promise.all(
        guests.map(async (guest) => {
            return {
                type: 'image',
                image_url: guest.user.userName
                    ? await githubAvatarRepository.getAvatarFor(
                          guest.user.userName
                      )
                    : DEFAULT_GITHUB_AVATAR,
                alt_text: guest.user.displayName,
            };
        })
    );

    return {
        text: `${guestsNames} pushed 1 commit: ${cleanCommitMessage}`,
        blocks: [
            {
                type: 'context',
                elements: [
                    ...guestsAvatars,
                    {
                        type: 'mrkdwn',
                        text: `${guestsNamesWithLink} pushed <${event.repoUrl}/commit/${event.commit.hash}|1 commit: ${cleanCommitMessage}>`,
                    },
                ],
            },
        ],
    };
};
