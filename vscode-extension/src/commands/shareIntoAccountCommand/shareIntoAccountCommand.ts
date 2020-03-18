import * as vscode from 'vscode';
import { accountsKeychain } from '../../accounts/accountsKeychain';
import { lsApi, startLSSession } from '../../branchBroadcast/liveshare';
import { SlackChannelSession } from '../../channels/SlackChannelSession';
import { CancellationError } from '../../errors/CancellationError';
import { getSlackAccountChannel } from './getSlackAccountChannel';

export const SLACK_USER_CHANNEL_TYPE = 'slack-user';
export const SLACK_CHANNEL_CHANNEL_TYPE = 'slack-channel';

export const shareIntoAccountCommand = async () => {
    if (!vscode.workspace.rootPath) {
        throw new Error('Please open a project to share.');
    }

    const READ_ONLY_BUTTON = 'Read-only session';
    const sessionReadOonluAnswer = await vscode.window.showQuickPick(
        ['Read/Write session', READ_ONLY_BUTTON],
        {
            placeHolder: 'Select session type',
            ignoreFocusOut: true,
        }
    );

    if (!sessionReadOonluAnswer) {
        throw new CancellationError('No session type selected.');
    }

    const isReadOnlySession = sessionReadOonluAnswer === READ_ONLY_BUTTON;

    const accounts = accountsKeychain.getAccountNames();

    // const connectors = connectorRepository.getConnectors();

    const accountOptions = accounts.map((account) => {
        return {
            label: account,
        };
    });

    const selectedAccount = await vscode.window.showQuickPick(accountOptions, {
        placeHolder: 'Select accounts to share into',
        // canPickMany: true,
    });

    if (!selectedAccount) {
        throw new CancellationError('No connectors selected.');
    }

    const slackChannel = await getSlackAccountChannel(selectedAccount.label);
    if (!slackChannel) {
        throw new CancellationError('No slack channel selected.');
    }

    await startLSSession(isReadOnlySession);
    const lsAPI = lsApi();

    const session = new SlackChannelSession(slackChannel, [], lsAPI);
    await session.init();
};
