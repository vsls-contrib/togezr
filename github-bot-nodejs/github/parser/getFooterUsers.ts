import { GITHUB_ISSUE_FOOTER_USERS_REGEX } from '../constants';

export const getFooterUsers = (text: string): string | null => {
    const match = text.match(GITHUB_ISSUE_FOOTER_USERS_REGEX);
    if (!match) {
        return null;
    }
    const users = match[0];
    if (!users) {
        return null;
    }
    return users;
};
