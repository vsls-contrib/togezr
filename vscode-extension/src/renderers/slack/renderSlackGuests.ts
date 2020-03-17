import { DEFAULT_GITHUB_AVATAR } from '../../sessionConnectors/constants';
import { githubAvatarRepository } from '../../sessionConnectors/github/githubAvatarsRepository';
import {
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from '../../sessionConnectors/renderer/events';

export const renderGuests = async (events: ISessionEvent[]) => {
    if (!events.length) {
        return [];
    }

    const guests = events.filter((e) => {
        return e.type === 'guest-join' || e.type === 'start-session';
    }) as (ISessionUserJoinEvent | ISessionStartEvent)[];

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
