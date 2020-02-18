import { getIssueOwner } from './getIssueOwner';
import { getIssueRepo } from './getIssueRepo';

export const getRepoUrlFromIssueUrl = (issueUrl: string): string => {
    return `https://github.com/${getIssueOwner(issueUrl)}/${getIssueRepo(
        issueUrl
    )}`;
};
