import * as vscode from 'vscode';
import { CancellationError } from '../../errors/CancellationError';
import {
    KNOWN_ACCOUNT_TYPES,
    TAccountType,
} from '../../interfaces/TAccountType';

export const getAccountTypeFromKnown = async () => {
    /**
     * Disable creating the `Teams` account until the better API times.
     */
    const list = KNOWN_ACCOUNT_TYPES.filter((item) => {
        return item !== 'Teams' && item !== 'Slack';
    });
    let accountType: TAccountType | undefined = list[0];
    if (list.length > 1) {
        accountType = (await vscode.window.showQuickPick(list, {
            placeHolder: 'Select account type',
        })) as TAccountType | undefined;
        if (!accountType) {
            throw new CancellationError();
        }
    }
    return accountType;
};
