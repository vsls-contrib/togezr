import { GITHUB_ISSUE_FOOTER_BADGE_REGEX } from '../constants';

export const getFooterBadge = (text: string): string | null => {
    const match = text.match(GITHUB_ISSUE_FOOTER_BADGE_REGEX);
    if (!match) {
        return null;
    }
    const badge = match[0];
    if (!badge) {
        return null;
    }
    return badge;
};
