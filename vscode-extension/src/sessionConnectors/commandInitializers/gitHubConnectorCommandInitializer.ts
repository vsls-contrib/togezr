import * as vscode from 'vscode';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { CancellationError } from '../../errors/CancellationError';
import { IConnectorCommandInitializer } from '../../interfaces/IConnectorCommandInitializer';
import { IGitHubInstallation } from '../../interfaces/IGitHubInstallation';
import { IGithubRepo } from '../../interfaces/IGitHubRepo';
import { sendGithubRequest } from '../../utils/sendGithubRequest';

export class GitHubConnectorCommandInitializer
    implements IConnectorCommandInitializer {
    public init = async () => {
        const token = await vscode.window.showInputBox({
            prompt: 'Set a GitHub auth token',
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
            }
        );

        if (!selectedInstallation) {
            throw new CancellationError('No GitHub repo owner is selected.');
        }

        const { installation } = selectedInstallation;

        const reposResult = await sendGithubRequest<{
            total_count: number;
            repositories: IGithubRepo[];
        }>(
            token,
            `https://api.github.com/user/installations/${installation.id}/repositories`,
            'GET',
            undefined,
            {
                Accept: 'application/vnd.github.machine-man-preview+json',
            }
        );

        const { repositories } = reposResult;

        const myRepos = repositories.filter((repo) => {
            return repo.permissions.push;
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

        await vscode.window.showInformationMessage(
            `The GitHub repo connector "${selectedRepo.repo.full_name}" added.`
        );
    };
}
