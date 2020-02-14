import * as vscode from 'vscode';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { CancellationError } from '../../errors/CancellationError';
import { IConnectorCommandInitializer } from '../../interfaces/IConnectorCommandInitializer';
import { getRepoName } from '../../utils/getRepoName';
import { getRepoOwner } from '../../utils/getRepoOwner';
import { sendGithubRequest } from '../../utils/sendGithubRequest';

export class GitHubConnectorCommandInitializer
    implements IConnectorCommandInitializer {
    public init = async () => {
        const githubRepoUrl = await vscode.window.showInputBox({
            prompt: 'Specify a GitHub repo',
            ignoreFocusOut: true,
        });
        if (!githubRepoUrl) {
            throw new CancellationError('No GitHub repo is specified.');
        }
        const token = await vscode.window.showInputBox({
            prompt: 'Set a GitHub auth token',
            ignoreFocusOut: true,
        });
        if (!token) {
            throw new CancellationError('No GitHub token is specified.');
        }
        const owner = getRepoOwner(githubRepoUrl);
        const repoName = getRepoName(githubRepoUrl);
        await vscode.window.withProgress(
            {
                title: 'Verifying permissions..',
                location: vscode.ProgressLocation.Notification,
            },
            async () => {
                try {
                    const result = await sendGithubRequest(
                        token,
                        `https://api.github.com/repos/${owner}/${repoName}/issues`,
                        'GET'
                    );
                    if ((result as any).message === 'Not Found') {
                        throw new CancellationError("Can't get repo issues.");
                    }
                } catch (e) {
                    if (e instanceof CancellationError) {
                        throw e;
                    }
                }
            }
        );
        const value = `${owner}/${repoName}`;
        const name = await vscode.window.showInputBox({
            prompt: 'What is the name of this connector?',
            ignoreFocusOut: true,
            value,
            valueSelection: [0, value.length],
        });
        if (!name) {
            throw new CancellationError('No connector name specified.');
        }
        await connectorRepository.addGitHubConnector(
            name,
            githubRepoUrl,
            token
        );
        await vscode.window.showInformationMessage(
            `The connector "${name}" successfully added.`
        );
    };
}
