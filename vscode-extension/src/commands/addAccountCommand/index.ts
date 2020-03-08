import * as vscode from 'vscode';
import { accountsKeychain } from '../../accounts/accountsKeychain';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { CancellationError } from '../../errors/CancellationError';
import {
    KNOWN_ACCOUNT_TYPES,
    TAccountType,
} from '../../interfaces/TAccountType';

const findNewAccountName = async (
    name: string,
    interation = 0
): Promise<string> => {
    const accountName = `${name}${interation || ''}`;
    const existingAccount = await accountsKeychain.getAccount(accountName);

    if (existingAccount) {
        return await findNewAccountName(name, interation + 1);
    }

    if (interation === 0) {
        return name;
    }

    return accountName;
};

const getAccountName = async (name: string): Promise<string> => {
    const inputValue = await findNewAccountName(name);

    const inputName = await vscode.window.showInputBox({
        prompt: 'What is the account name?',
        value: inputValue,
        valueSelection: [0, inputValue.length],
        ignoreFocusOut: true,
    });

    if (!inputName) {
        throw new CancellationError();
    }

    const existingAccount = await accountsKeychain.getAccount(inputName);

    if (existingAccount) {
        vscode.window.showInformationMessage(
            `Account "${inputName}" already exists. Please pick a different name.`
        );

        return await getAccountName(inputName);
    }

    return inputName;
};

export const addAccountCommand = async () => {
    let type: TAccountType | undefined = KNOWN_ACCOUNT_TYPES[0];
    if (KNOWN_ACCOUNT_TYPES.length > 1) {
        type = (await vscode.window.showQuickPick(KNOWN_ACCOUNT_TYPES, {
            placeHolder: 'Select account type',
        })) as TAccountType | undefined;

        if (!type) {
            throw new CancellationError();
        }
    }

    const name = await getAccountName(type);

    const token = await vscode.window.showInputBox({
        prompt: 'Provide token for this account',
        ignoreFocusOut: true,
    });

    if (!token) {
        throw new CancellationError();
    }

    await accountsKeychain.addAccount({
        type,
        name,
        token,
    });

    vscode.window.showInformationMessage(`Account "${name}" added.`);

    refreshActivityBar();
};
