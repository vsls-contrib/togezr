import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { TAccountRecord } from '../../interfaces/IAccountRecord';
import { getIconPack } from '../../utils/icons';

export class AccountTreeItem extends TreeItem {
    constructor(public account: TAccountRecord) {
        super(account.name, TreeItemCollapsibleState.Expanded);

        this.iconPath = getIconPack(this.getAccountIconName(account));
    }

    private getAccountIconName = (account: TAccountRecord) => {
        if (account.type === 'GitHub') {
            return 'github-icon.svg';
        }

        if (account.type === 'Slack') {
            return 'slack-icon.svg';
        }

        if (account.type === 'Teams') {
            return 'teams-icon.svg';
        }

        throw new Error(`Not know account type: "${(account as any).type}"`);
    };

    get contextValue() {
        if (this.account.type === 'GitHub') {
            return 'togezr.account.github';
        }

        if (this.account.type === 'Slack') {
            return 'togezr.account.slack';
        }

        if (this.account.type === 'Teams') {
            return 'togezr.account.teams';
        }

        throw new Error(
            `Unknown account type "${(this.account as any).type}".`
        );
    }
}
