import * as vscode from 'vscode';
import { accountsKeychain } from '../../accounts/accountsKeychain';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { refreshLiveShareTeamsActivityBar } from '../../activityBar/liveShareTeamsActivityPanel';
import { CancellationError } from '../../errors/CancellationError';
import { ISlackTeam } from '../../interfaces/ISlackTeam';
import { ISlackTeamInfoWebCallResult } from '../../interfaces/ISlackUserWithIM';
import {
    KNOWN_ACCOUNT_TYPES,
    TAccountType,
} from '../../interfaces/TAccountType';
import { getSlackAPIByToken } from '../../slack/slackAPI';

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

const getAccountName = async (
    name: string,
    defaultName?: string
): Promise<string> => {
    const inputValue = await findNewAccountName(defaultName || name);

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

const getAccountTypeFromKnown = async () => {
    /**
     * Disable creating the `Teams` account until the better API times.
     */
    const list = KNOWN_ACCOUNT_TYPES.filter((item) => {
        return item !== 'Teams';
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

export const addAccountCommand = async (accountType?: TAccountType) => {
    accountType = accountType || (await getAccountTypeFromKnown());

    const token = await vscode.window.showInputBox({
        prompt: 'Provide token for this account',
        ignoreFocusOut: true,
    });

    if (!token) {
        throw new CancellationError();
    }

    let slackTeam: ISlackTeam | undefined;

    if (accountType === 'Slack') {
        const api = await getSlackAPIByToken(token);
        const teamInfoResponse: ISlackTeamInfoWebCallResult = await api.team.info();

        if (!teamInfoResponse.ok) {
            throw new Error('Cannot get Slack team info.');
        }

        const { team } = teamInfoResponse;
        if (!team) {
            throw new Error(
                'Got teams response from Slack API, but no "team" property set.'
            );
        }
        slackTeam = team;
    }

    const name = await getAccountName(accountType, slackTeam?.name);

    const account = {
        type: accountType,
        name,
        token,
        team: slackTeam,
    };

    await accountsKeychain.addAccount(account);

    vscode.window.showInformationMessage(`Account "${name}" added.`);

    refreshActivityBar();
    refreshLiveShareTeamsActivityBar();
};
