import * as vscode from 'vscode';
import { accountsKeychain } from '../../accounts/accountsKeychain';
import {
    AccountTreeItem,
    refreshActivityBar,
} from '../../activityBar/activityBar';
import { CancellationError } from '../../errors/CancellationError';

const confirmDeletion = async (accountName: string): Promise<Boolean> => {
    const REMOVE_BUTTON = 'Remove';
    const answer = await vscode.window.showInformationMessage(
        `Are you sure you want to remove "${accountName}" account?`,
        REMOVE_BUTTON
    );

    return answer === REMOVE_BUTTON;
};

export const removeAccountCommand = async (item?: AccountTreeItem) => {
    if (item) {
        const { account } = item;

        const isConfirmed = await confirmDeletion(account.name);
        if (!isConfirmed) {
            throw new CancellationError();
        }

        accountsKeychain.deleteAccount(account.name);
        refreshActivityBar();
        return;
    }

    const accounts = await accountsKeychain.getAllAccounts();
    if (!accounts) {
        vscode.window.showInformationMessage('No accounts found.');

        return;
    }

    const options = accounts.map((account) => {
        return {
            label: account.name,
            description: account.type,
        };
    });

    const answer = await vscode.window.showQuickPick(options, {
        ignoreFocusOut: true,
        placeHolder: 'Select account to remove',
    });

    if (!answer) {
        throw new CancellationError();
    }

    const isConfirmed = await confirmDeletion(answer.label);
    if (!isConfirmed) {
        throw new CancellationError();
    }

    accountsKeychain.deleteAccount(answer.label);
    refreshActivityBar();
};
