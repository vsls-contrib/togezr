import * as vscode from 'vscode';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { CommandId } from '../../commands/registerCommand';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { CancellationError } from '../../errors/CancellationError';
import { IConnectorCommandInitializer } from '../../interfaces/IConnectorCommandInitializer';

export class TeamsConnectorCommandInitializer
    implements IConnectorCommandInitializer {
    public init = async () => {
        const webhookUrl = await vscode.window.showInputBox({
            prompt: '🤔 What is the WebHook URL?',
            ignoreFocusOut: true,
        });

        if (!webhookUrl) {
            throw new CancellationError('No WebHook URL specified.');
        }

        const name = await vscode.window.showInputBox({
            prompt: '🤔 What is the name of this connector?',
            ignoreFocusOut: true,
        });

        if (!name) {
            throw new CancellationError('No WebHook name specified.');
        }

        await connectorRepository.addTeamsConnector(webhookUrl, name);

        refreshActivityBar();

        const USE_BUTTON = 'Connect a branch.';
        const answer = await vscode.window.showInformationMessage(
            `The Teams connector "${name}" added. Start using it now!`,
            USE_BUTTON
        );

        if (answer === USE_BUTTON) {
            await vscode.commands.executeCommand(CommandId.connectBranch);
        }
    };
}
