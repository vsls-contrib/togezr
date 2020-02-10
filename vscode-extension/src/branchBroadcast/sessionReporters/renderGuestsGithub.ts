import { IGuestWithSessions } from '../../commands/registerBranch/branchRegistry';
import { isEmail } from '../../utils/isEmail';
import { DEFAULT_GITHUB_AVATAR } from './constants';
import { getGithubAvatar, getGithubUsername } from './githubSessionReporter';

export const renderGuestsGithub = async (guests: IGuestWithSessions[]) => {
    const resultPromises = guests.map(async (guest) => {
        const username = getGithubUsername(guest.data);
        if (!username || isEmail(username)) {
            return `<img src="${DEFAULT_GITHUB_AVATAR}" width="40" alt="${guest.data.email}" title="${guest.data.name} (${guest.data.email}) ${guest.sessionCount} sessions" />`;
        }
        const avatarUrl = await getGithubAvatar(username);
        const image = `<img src="${avatarUrl}" width="40" alt="${username}" title="${guest.data.name} (@${username}) ${guest.sessionCount} sessions" />`;
        return `[${image}](https://github.com/${username})`;
    });
    const result = await Promise.all(resultPromises);
    return result.join(' ');
};
