import { DEFAULT_GITHUB_AVATAR } from '../../sessionConnectors/constants';
import { githubAvatarRepository } from '../../sessionConnectors/github/githubAvatarsRepository';
import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { getUserEvents } from '../../utils/getUserEvents';

export const renderGuests = async (events: ISessionEvent[]) => {
    if (!events.length) {
        return [];
    }

    const guests = getUserEvents(events);

    const renderedGuestsPromises: any[] = guests.map(async (guest) => {
        const imageUrl = guest.user.userName
            ? await githubAvatarRepository.getAvatarFor(guest.user.userName)
            : DEFAULT_GITHUB_AVATAR;

        return {
            type: 'image',
            image_url: imageUrl,
            alt_text: `${guest.user.displayName} (${guest.user.emailAddress})`,
        };
    });
    const renderedGuests = await Promise.all(renderedGuestsPromises);
    const suffix = renderedGuests.length === 1 ? '' : 's';

    renderedGuests.push({
        type: 'mrkdwn',
        text: `*${renderedGuests.length} guest${suffix}*`,
    });

    return [
        {
            type: 'context',
            elements: renderedGuests,
        },
    ];
};
