import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { Repository } from '../../typings/git';
import {
    ISSUE_SESSION_DETAILS_FOOTER,
    ISSUE_SESSION_DETAILS_HEADER,
} from './constants';
import { getIssueDetailsGit } from './getIssueDetailsGit';
import { getIssueDetailsLiveShare } from './getIssueDetailsLiveShare';
import { renderGuestsGithub } from './renderGuestsGithub';

export const getIssueTextWithDetailsGithub = async (
    description: string,
    data: IRegistryData,
    repo: Repository
) => {
    const descriptionRegex = /(\!\[togezr\sseparator\]\(https:\/\/aka\.ms\/togezr-issue-separator-image\)[\s\S]+\#\#\#\#\#\# powered by \[Togezr\]\(https\:\/\/aka\.ms\/togezr-issue-website-link\))/gm;
    const isPresent = !!description.match(descriptionRegex);
    const issueDetails = [
        ISSUE_SESSION_DETAILS_HEADER,
        getIssueDetailsGit(data, repo),
        await renderGuestsGithub(data.guests),
        getIssueDetailsLiveShare(data),
        ISSUE_SESSION_DETAILS_FOOTER,
    ].join('\n\n');
    if (isPresent) {
        return description.replace(descriptionRegex, issueDetails);
    }
    return `${description}\n\n${issueDetails}`;
};
