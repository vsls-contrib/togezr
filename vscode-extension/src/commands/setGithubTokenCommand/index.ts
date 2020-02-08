import * as vscode from 'vscode';
import * as keytar from '../../keytar';

export const setGithubTokenCommand = async () => {
    const token = await vscode.window.showInputBox({
        prompt: 'GitHub API token',
        password: true,
        ignoreFocusOut: true,
    });

    if (!token) {
        throw new Error('No GitHub API token set.');
    }

    await keytar.set('githubSecret', token);
    await vscode.window.showInformationMessage('GitHub API token is set.');
};
