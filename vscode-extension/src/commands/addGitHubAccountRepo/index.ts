import * as vscode from 'vscode';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { CancellationError } from '../../errors/CancellationError';
import { getGithubAPI } from '../../github/githubAPI';
import { githubReposRepository } from '../../github/githubReposRepository';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { IGithubRepo } from '../../interfaces/IGitHubRepo';

export const addGitHubAccountRepo = async (account: IGitHubAccountRecord) => {
    if (!account) {
        throw new Error(`[addGitHubAccountRepo]: no "account" argument set.`);
    }

    const api = await getGithubAPI(account.name);

    const reposResponse = await api.repos.list({
        per_page: 100,
        affiliation: 'owner, collaborator',
        sort: 'pushed',
    });

    if (reposResponse.status !== 200) {
        throw new Error(
            `Cannot get repos for the GitHub account "${account.name}"`
        );
    }
    const repos = reposResponse.data as IGithubRepo[];
    if (!repos.length) {
        throw new Error(`Zero repos available.`);
    }

    const options = repos.map((repo) => {
        return {
            label: repo.name,
            description: repo.description,
            repo,
        };
    });

    const selectedRepoAnswer = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select a repo',
        ignoreFocusOut: true,
    });

    if (!selectedRepoAnswer) {
        throw new CancellationError('No repo was selected.');
    }

    const { repo } = selectedRepoAnswer;

    githubReposRepository.add(account.name, repo);
    refreshActivityBar();

    await vscode.window.showInformationMessage(
        `The GitHub account repo "${repo.name}" added.`
    );
};
