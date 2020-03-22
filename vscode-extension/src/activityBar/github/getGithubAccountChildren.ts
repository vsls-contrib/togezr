import { githubReposRepository } from '../../github/githubReposRepository';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { GitHubAccountAddMoreTreeItem } from './GitHubAccountAddMoreTreeItem';
import { GitHubAccountRepoTreeItem } from './GitHubAccountRepoTreeItem';

export const getGithubAccountChildren = async (
    account: IGitHubAccountRecord
) => {
    const result = [];
    const repos = githubReposRepository.get(account.name);
    for (let repo of repos) {
        const repoTreeItem = new GitHubAccountRepoTreeItem(account, repo.repo);
        result.push(repoTreeItem);
    }
    if (result.length === 0) {
        result.push(new GitHubAccountAddMoreTreeItem('+ Add repo...', account));
    }
    return result;
};
