import { URL } from 'url';
import * as vscode from 'vscode';
import { QuickPickItem } from 'vscode';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { CancellationError } from '../../errors/CancellationError';
import { UserError } from '../../errors/UserError';
import { getGithubAPI } from '../../github/githubAPI';
import { githubReposRepository } from '../../github/githubReposRepository';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { IShortGithubRepo } from '../../interfaces/IGitHubRepo';
import { getRepoName } from '../../utils/getRepoName';
import { getRepoOwner } from '../../utils/getRepoOwner';

const getRepoFromUrl = async (
    account: IGitHubAccountRecord
): Promise<IShortGithubRepo> => {
    const url = await vscode.window.showInputBox({
        prompt: 'Please provide repo URL',
    });

    if (!url) {
        throw new CancellationError('No repo URL provided.');
    }

    try {
        // make sure that is real URL
        new URL(url);

        const api = await getGithubAPI(account.name);
        const repoResponse = await api.repos.get({
            owner: getRepoOwner(url),
            repo: getRepoName(url),
        });

        if (repoResponse.status !== 200) {
            throw new Error(
                `Cannot get the ${url} repo for the GitHub account "${account.name}."`
            );
        }

        const repo = repoResponse.data as IShortGithubRepo;

        return repo;
    } catch (e) {
        throw new UserError('Cannot parse URL.');
    }
};

export const addGitHubAccountEntityCommand = async (
    account: IGitHubAccountRecord
) => {
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

    const repos = reposResponse.data as IShortGithubRepo[];
    if (!repos.length) {
        throw new Error(`Zero repos available.`);
    }

    interface IOptionWithRepo extends QuickPickItem {
        repo: IShortGithubRepo;
    }
    const allOptions: (QuickPickItem | IOptionWithRepo)[] = [];

    const addRepoUrlOption: QuickPickItem = {
        label: `+ Add repo url`,
        description: 'Add repo reference from URL',
    };

    allOptions.push(addRepoUrlOption);

    const options = repos
        .filter((repo) => {
            const existingRepos = githubReposRepository.get(account.name);
            const existingRepo = existingRepos.find((repoRecord) => {
                return repoRecord.repo.id === repo.id;
            });
            return !existingRepo;
        })
        .map((repo) => {
            return {
                label: repo.name,
                description: repo.description,
                repo,
            };
        });

    allOptions.push(...options);

    const selectedRepoAnswer = await vscode.window.showQuickPick(allOptions, {
        placeHolder: 'Select repo',
        ignoreFocusOut: true,
    });

    if (!selectedRepoAnswer) {
        throw new CancellationError('No repo was selected.');
    }

    const repo =
        selectedRepoAnswer.label === addRepoUrlOption.label
            ? await getRepoFromUrl(account)
            : (selectedRepoAnswer as IOptionWithRepo).repo;

    githubReposRepository.add(account.name, repo);

    refreshActivityBar();

    await vscode.window.showInformationMessage(`"${repo.name}" repo added.`);
};
