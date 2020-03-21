import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { CommandId } from '../../commands/registerCommand';
import { githubReposRepository } from '../../github/githubReposRepository';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { IGithubRepo } from '../../interfaces/IGitHubRepo';
import { getSlackAccountChildren } from '../slack/getSlackAccountChildren';
import { AccountTreeItem } from './AccountTreeItem';

class GitHubAccountAddMoreTreeItem extends TreeItem {
    constructor(label: string, account: IGitHubAccountRecord) {
        super(label);

        this.command = {
            title: label,
            command: CommandId.addGitHubAccountRepo,
            tooltip: label,
            arguments: [account],
        };
    }
}

class GitHubAccountRepoTreeItem extends TreeItem {
    constructor(public repo: IGithubRepo) {
        super(repo.name, TreeItemCollapsibleState.Expanded);

        this.description = this.repo.description;
    }
}

const getGithubAccountChildren = async (account: IGitHubAccountRecord) => {
    const result = [];

    const repos = githubReposRepository.get(account.name);

    for (let repo of repos) {
        const repoTreeItem = new GitHubAccountRepoTreeItem(repo.repo);
        result.push(repoTreeItem);
    }

    console.log(repos);

    if (result.length === 0) {
        result.push(new GitHubAccountAddMoreTreeItem('+ Add repo...', account));
    }

    return result;
};

export const getAccountChildren = async (element: AccountTreeItem) => {
    const { account } = element;

    switch (account.type) {
        case 'Slack': {
            return await getSlackAccountChildren(account);
        }

        case 'GitHub': {
            return await getGithubAccountChildren(account);
        }

        default: {
            throw new Error(`Unknown account type "${account.type}".`);
        }
    }
};
``;
