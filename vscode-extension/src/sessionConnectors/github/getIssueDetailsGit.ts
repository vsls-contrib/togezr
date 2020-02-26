import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { IGitHubIssue } from '../../interfaces/IGitHubIssue';
import { getRepoUrlFromIssueUrl } from './getRepoUrlFromIssueUrl';

export const getIssueDetailsGit = (
    data: IRegistryData,
    githubIssue: IGitHubIssue
) => {
    const { branchName } = data;
    const repoUrl = getRepoUrlFromIssueUrl(githubIssue.html_url);
    const result = `**⎇** [${branchName}](${repoUrl}/tree/${branchName}) [ [⇄ master](${repoUrl}/compare/${branchName}) ]`;
    return result;
};
