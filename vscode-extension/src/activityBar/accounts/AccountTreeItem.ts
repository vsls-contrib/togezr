import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { TAccountRecord } from '../../interfaces/IAccountRecord';
import { getIconPack } from '../../utils/icons';

export class AccountTreeItem extends TreeItem {
    public contextValue: string = 'togezr.account';

    constructor(public account: TAccountRecord) {
        super(account.name, TreeItemCollapsibleState.Expanded);

        this.iconPath = getIconPack(this.getAccountIconName(account));
        this.contextValue = 'togezr.account';
    }
    private getAccountIconName(account: TAccountRecord) {
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
    }
}
