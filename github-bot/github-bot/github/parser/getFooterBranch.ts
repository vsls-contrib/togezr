import { GITHUB_ISSUE_FOOTER_BRANCH_REGEX } from '../constants';

export const getFooterBranch = (text: string): string | null => {
    const match = text.match(GITHUB_ISSUE_FOOTER_BRANCH_REGEX);
    if (!match) {
        return null;
    }
    const branch = match[0];
    if (!branch) {
        return null;
    }
    return branch;
};
