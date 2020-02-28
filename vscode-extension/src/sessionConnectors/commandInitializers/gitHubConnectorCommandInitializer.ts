import * as vscode from 'vscode';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { CommandId } from '../../commands/registerCommand';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { CancellationError } from '../../errors/CancellationError';
import { IConnectorCommandInitializer } from '../../interfaces/IConnectorCommandInitializer';
import { IGitHubInstallation } from '../../interfaces/IGitHubInstallation';
import { IGithubRepo } from '../../interfaces/IGitHubRepo';
import { sendGithubRequest } from '../../utils/sendGithubRequest';

const getAllGithubRepos = async (
    token: string,
    installation: IGitHubInstallation
) => {
    const result = [];
    let i = 1;
    let total_count = Infinity;

    do {
        const reposResult = await sendGithubRequest<{
            total_count: number;
            repositories: IGithubRepo[];
        }>(
            token,
            `https://api.github.com/user/installations/${
                installation.id
            }/repositories?type=all&per_page=100&page=${i++}`,
            'GET',
            undefined,
            {
                Accept: 'application/vnd.github.machine-man-preview+json',
            }
        );

        const { repositories } = reposResult;

        total_count = reposResult.total_count;

        result.push(...repositories);
    } while (result.length < total_count || i >= 10);

    return result;
};

export class GitHubConnectorCommandInitializer
    implements IConnectorCommandInitializer {
    public init = async () => {
        const token = await vscode.window.showInputBox({
            prompt: '🤔 What is your GitHub token?',
            ignoreFocusOut: true,
        });

        if (!token) {
            throw new CancellationError('No GitHub token is specified.');
        }

        const installationsResult = await sendGithubRequest<{
            total_count: number;
            installations: IGitHubInstallation[];
        }>(
            token,
            'https://api.github.com/user/installations',
            'GET',
            undefined,
            {
                Accept: 'application/vnd.github.machine-man-preview+json',
            }
        );

        const { installations } = installationsResult;

        if (!installations.length) {
            throw new Error('No installations found for this token.');
        }

        const installationOptions = installations.map((installation) => {
            return {
                label: installation.account.login,
                installation,
            };
        });

        const selectedInstallation = await vscode.window.showQuickPick(
            installationOptions,
            {
                ignoreFocusOut: true,
                canPickMany: false,
                placeHolder: `Select an account`,
            }
        );

        if (!selectedInstallation) {
            throw new CancellationError('No GitHub repo owner is selected.');
        }

        const { installation } = selectedInstallation;

        const repositories = await getAllGithubRepos(token, installation);

        const myRepos = repositories
            .filter((repo) => {
                return repo.permissions.push;
            })
            // .sort((repo1, repo2) => {
            //     // const date1 = new Date(repo1.updated_at);
            //     // const date2 = new Date(repo2.updated_at);

            //     if (repo1.updated_at > repo2.updated_at) {
            //         return -1;
            //     }

            //     if (repo2.updated_at > repo1.updated_at) {
            //         return 1;
            //     }

            //     return 0;
            // });
            .sort((repo1, repo2) => {
                const date1 = new Date(repo1.pushed_at).getTime();
                const date2 = new Date(repo2.pushed_at).getTime();

                return date2 - date1;
            });

        const repoOptions = myRepos.map((repo) => {
            return {
                label: repo.full_name,
                description: repo.description,
                repo,
            };
        });

        const selectedRepo = await vscode.window.showQuickPick(repoOptions, {
            ignoreFocusOut: true,
            canPickMany: false,
            placeHolder: 'Please select a GitHub repo',
        });

        if (!selectedRepo) {
            throw new CancellationError('No repo selected.');
        }

        await connectorRepository.addGitHubConnector(
            selectedRepo.repo.full_name,
            selectedRepo.repo,
            token
        );

        refreshActivityBar();

        const USE_BUTTON = 'Connect a branch.';
        const answer = await vscode.window.showInformationMessage(
            `The GitHub repo connector "${selectedRepo.repo.full_name}" added. Start using it now!`,
            USE_BUTTON
        );

        if (answer === USE_BUTTON) {
            await vscode.commands.executeCommand(CommandId.connectBranch);
        }
    };
}
