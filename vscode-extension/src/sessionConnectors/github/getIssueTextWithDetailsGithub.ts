import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { Repository } from '../../typings/git';
import {
    ISSUE_SESSION_DETAILS_FOOTER,
    ISSUE_SESSION_DETAILS_HEADER,
} from '../constants';
import { getIssueDetailsGit } from './getIssueDetailsGit';
import { getIssueDetailsLiveShare } from './getIssueDetailsLiveShare';
import { renderGuestsGithub } from './renderGuestsGithub';

export const getIssueTextWithDetailsGithub = async (
    description: string,
    data: IRegistryData,
    repo?: Repository
) => {
    if (!repo) {
        throw new Error('Pleae open a repo to proceed.');
    }

    const descriptionRegex = /(\!\[togezr\sseparator\]\(https:\/\/aka\.ms\/togezr-issue-separator-image\)[\s\S]+\#\#\#\#\#\# powered by \[Togezr\]\(https\:\/\/aka\.ms\/togezr-issue-website-link\))/gm;
    const isPresent = !!description.match(descriptionRegex);

    const guestsWithBranchInfo = [
        await renderGuestsGithub(data.guests),
        getIssueDetailsGit(data, repo),
    ].join('\n');

    const issueDetails = [
        ISSUE_SESSION_DETAILS_HEADER,
        getIssueDetailsLiveShare(data),
        guestsWithBranchInfo,
        ISSUE_SESSION_DETAILS_FOOTER,
    ].join('\n\n');
    if (isPresent) {
        return description.replace(descriptionRegex, issueDetails);
    }
    return `${description}\n\n${issueDetails}`;
};
