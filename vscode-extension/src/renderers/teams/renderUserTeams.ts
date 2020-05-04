import { DEFAULT_GITHUB_AVATAR } from '../../sessionConnectors/constants';
import { githubAvatarRepository } from '../../sessionConnectors/github/githubAvatarsRepository';
import {
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from '../../sessionConnectors/renderer/events';
export const renderUserTeams = async (
    event: ISessionStartEvent | ISessionUserJoinEvent
) => {
    const imageUrl = event.user.userName
        ? await githubAvatarRepository.getAvatarFor(event.user.userName)
        : DEFAULT_GITHUB_AVATAR;
    return {
        type: 'Column',
        padding: 'None',
        width: 'auto',
        items: [
            {
                type: 'Image',
                url: imageUrl,
                size: 'Small',
                spacing: 'None',
            },
        ],
    };
};
