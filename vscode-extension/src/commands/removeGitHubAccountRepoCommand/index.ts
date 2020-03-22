import * as vscode from 'vscode';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { GitHubAccountRepoTreeItem } from '../../activityBar/github/GitHubAccountRepoTreeItem';
import { githubReposRepository } from '../../github/githubReposRepository';

export const removeGitHubAccountRepoCommand = async (
    treeItem?: GitHubAccountRepoTreeItem
) => {
    if (!treeItem) {
        throw new Error(`[addGitHubAccountRepo]: no "account" argument set.`);
    }

    const { account, repo } = treeItem;

    githubReposRepository.remove(account.name, repo);
    refreshActivityBar();

    await vscode.window.showInformationMessage(
        `The repo "${repo.name}" removed.`
    );
};
