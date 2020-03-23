import * as vscode from 'vscode';
import { AccountTreeItem } from '../../activityBar/accounts/AccountTreeItem';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { CancellationError } from '../../errors/CancellationError';
import { getGithubAPI } from '../../github/githubAPI';
import { githubReposRepository } from '../../github/githubReposRepository';
import {
    IGitHubAccountRecord,
    ITeamsAccountRecord,
} from '../../interfaces/IAccountRecord';
import { IGithubRepo } from '../../interfaces/IGitHubRepo';
import { TeamsAPI } from '../../teams/teamsAPI';
import { teamsTeamsRepository } from '../../teams/teamsTeamsRepository';

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
    const repos = reposResponse.data as IGithubRepo[];
    if (!repos.length) {
        throw new Error(`Zero repos available.`);
    }

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

    const selectedRepoAnswer = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select repo',
        ignoreFocusOut: true,
    });

    if (!selectedRepoAnswer) {
        throw new CancellationError('No repo was selected.');
    }

    const { repo } = selectedRepoAnswer;

    githubReposRepository.add(account.name, repo);
    refreshActivityBar();

    await vscode.window.showInformationMessage(`"${repo.name}" repo added.`);
};

const addTeamsAccountEntityCommand = async (account: ITeamsAccountRecord) => {
    const api = new TeamsAPI(account);

    const teams = await api.getUserJoinedTeams();

    const options = teams.map((team) => {
        return {
            label: team.displayName,
            description: team.description,
            team,
        };
    });

    const answer = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select team',
        ignoreFocusOut: true,
    });

    if (!answer) {
        throw new CancellationError('No team selected.');
    }

    teamsTeamsRepository.add(account.name, answer.team);

    refreshActivityBar();

    await vscode.window.showInformationMessage(
        `"${answer.team.displayName}" team added.`
    );
};

export const addAccountEntityCommand = async (treeItem?: AccountTreeItem) => {
    if (!treeItem) {
        throw new Error(
            `[addAccountEntityCommand]: no "account" argument set.`
        );
    }

    const { account } = treeItem;

    if (account.type === 'GitHub') {
        return await addGitHubAccountEntityCommand(account);
    }

    if (account.type === 'Teams') {
        return await addTeamsAccountEntityCommand(account);
    }

    throw new Error(`Unknown account type "${account.type}".`);
};
