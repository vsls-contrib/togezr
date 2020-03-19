import * as vscode from 'vscode';
import { accountsKeychain } from '../../accounts/accountsKeychain';
import { CancellationError } from '../../errors/CancellationError';
import { getSlackAccountChannel } from './getSlackAccountChannel';

export const askUserForChannel = async () => {
    const accounts = accountsKeychain.getAccountNames();
    const accountOptions = accounts.map((account) => {
        return {
            label: account,
        };
    });
    const selectedAccount = await vscode.window.showQuickPick(accountOptions, {
        placeHolder: 'Select account to share into',
    });
    if (!selectedAccount) {
        throw new CancellationError('No connectors selected.');
    }
    const slackChannel = await getSlackAccountChannel(selectedAccount.label);
    return slackChannel;
};
