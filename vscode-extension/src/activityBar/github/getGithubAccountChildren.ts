import { githubReposRepository } from '../../github/githubReposRepository';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { AccountAddMoreTreeItem } from '../accounts/AccountAddMoreTreeItem';
import { AccountTreeItem } from '../accounts/AccountTreeItem';
import { GitHubAccountRepoTreeItem } from './GitHubAccountRepoTreeItem';

export const getGithubAccountChildren = async (
    account: IGitHubAccountRecord,
    element: AccountTreeItem
) => {
    const result = [];
    const repos = githubReposRepository.get(account.name);

    for (let repo of repos) {
        const repoTreeItem = new GitHubAccountRepoTreeItem(account, repo.repo);
        result.push(repoTreeItem);
    }

    if (result.length === 0) {
        result.push(new AccountAddMoreTreeItem('+ Add repo...', element));
    }

    return result;
};
