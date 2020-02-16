import { getRepoOrigin } from '../../branchBroadcast/git';
import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { Repository } from '../../typings/git';

export const getIssueDetailsGit = (data: IRegistryData, repo: Repository) => {
    const { branchName } = data;
    const repoUrl = getRepoOrigin(repo).replace(/\.git$/i, '');
    const result = `**⎇** [${branchName}](${repoUrl}/tree/${branchName}) [ [⇄ master](${repoUrl}/compare/${branchName}) ]`;
    return result;
};
