import { IGuestWithSessions } from '../commands/registerBranch/branchRegistry';
import { isEmail } from '../utils/isEmail';
import { DEFAULT_GITHUB_AVATAR } from './constants';
import { getGithubAvatar, getGithubUsername } from './githubSessionConnector';

export const renderGuestsGithub = async (guests: IGuestWithSessions[]) => {
    const resultPromises = guests.map(async (guest) => {
        const username = getGithubUsername(guest.data);
        const suffix =
            guest.sessionCount > 0 ? `${guest.sessionCount} sessions` : '';

        if (!username || isEmail(username)) {
            return `<img src="${DEFAULT_GITHUB_AVATAR}" width="40" alt="${guest.data.emailAddress}" title="${guest.data.displayName} (${guest.data.emailAddress}) ${suffix}" />`;
        }

        const avatarUrl = await getGithubAvatar(username);

        const image = `<img src="${avatarUrl}" width="40" alt="${username}" title="${guest.data.displayName} (@${username}) ${suffix}" />`;
        return `[${image}](https://github.com/${username})`;
    });
    const result = await Promise.all(resultPromises);
    return result.join(' ');
};
