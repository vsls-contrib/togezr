import {
    Disposable,
    Event,
    EventEmitter,
    TreeDataProvider,
    TreeItem,
    window,
} from 'vscode';
import { accountsKeychain } from '../accounts/accountsKeychain';
import { TEAMS_ACCOUNT_TYPE } from '../interfaces/TAccountType';
import { getIconPack } from '../utils/icons';
import { AccountTreeItem } from './accounts/AccountTreeItem';
import { getAccountChildren } from './accounts/getAccountChildren';
import { getTeamsChannels } from './teams/getTeamsChannels';
import { getTeamsTeams } from './teams/getTeamsTeams';
import { getTeamsUsers } from './teams/getTeamsUsers';
import { TeamsTeamsTreeItem } from './teams/TeamsTeamsTreeItem';
import { TeamsTeamTreeItem } from './teams/TeamsTeamTreeItem';
import { TeamsUsersTreeItem } from './teams/TeamsUsersTreeItem';

class SignInTreeItem extends TreeItem {
    constructor(label = 'Sign into Teams..') {
        super(label);

        this.command = {
            title: 'Sign into Teams..',
            command: 'togezr.addAccount',
            arguments: [TEAMS_ACCOUNT_TYPE],
        };

        this.iconPath = getIconPack('account-icon.svg');
    }
}

export class ActivityBar implements TreeDataProvider<TreeItem>, Disposable {
    private _disposables: Disposable[] = [];

    private _onDidChangeTreeData = new EventEmitter<TreeItem>();
    public readonly onDidChangeTreeData: Event<TreeItem> = this
        ._onDidChangeTreeData.event;

    constructor() {
        // RUNNING_BRANCH_CONNECTIONS_ITEM.iconPath = getIconPack(
        //     'currently-running-icon.svg'
        // );
        // BRANCH_CONNECTIONS_ITEM.iconPath = getIconPack('branch-icon.svg');
        // CONNECTORS_ITEM.iconPath = getIconPack('connector-icon.svg');
        // ACCOUNTS_ITEM.contextValue = 'togezr.accounts.header';
        // slackUserStatusRepository.onUserStatus(() => {
        //     this._onDidChangeTreeData.fire();
        // });
        // setInterval(async () => {
        //     await slackUserStatusRepository.refreshStatuses();
        // }, 5000);
    }

    public refresh() {
        this._onDidChangeTreeData.fire();
    }

    public getChildren = async (element?: TreeItem): Promise<TreeItem[]> => {
        if (!element) {
            const accounts = await accountsKeychain.getAllAccounts();

            const teamsAccounts = accounts
                .filter((account) => {
                    return account.type === 'Teams';
                })
                .map((account) => {
                    const item = new AccountTreeItem(account);
                    return item;
                });

            if (!teamsAccounts.length) {
                return [new SignInTreeItem()];
            }

            if (teamsAccounts.length > 1) {
                return teamsAccounts;
            }

            return await getAccountChildren(teamsAccounts[0]);
        }

        if (element instanceof AccountTreeItem) {
            return await getAccountChildren(element);
        }

        /**
         * Teams
         */
        if (element instanceof TeamsTeamsTreeItem) {
            return await getTeamsTeams(element);
        }
        if (element instanceof TeamsUsersTreeItem) {
            return await getTeamsUsers(element);
        }
        if (element instanceof TeamsTeamTreeItem) {
            return await getTeamsChannels(element);
        }

        return [];
    };

    public getTreeItem(node: TreeItem): TreeItem {
        return node;
    }

    public dispose() {
        this._disposables.forEach((disposable) => disposable.dispose());
    }
}

let treeDataProvider: ActivityBar;
export const registerLiveShareTeamsActivityBar = () => {
    treeDataProvider = new ActivityBar();

    window.createTreeView(`togezr.liveshare.teams.contacts`, {
        treeDataProvider,
    });
};

export const refreshLiveShareTeamsActivityBar = () => {
    if (!treeDataProvider) {
        throw new Error(
            'ActivityBar is not initialized, call `registerActivityBar` first.'
        );
    }

    treeDataProvider.refresh();
};
