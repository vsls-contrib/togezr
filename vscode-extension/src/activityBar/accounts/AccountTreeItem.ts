import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { getIconPack } from '../../utils/icons';

export class AccountTreeItem extends TreeItem {
    public contextValue: string = 'togezr.account';

    constructor(public account: IAccountRecord) {
        super(account.name, TreeItemCollapsibleState.Expanded);
        this.iconPath = getIconPack(this.getAccountIconName(account));
        this.contextValue = 'togezr.account';
    }
    private getAccountIconName(connector: IAccountRecord) {
        if (connector.type === 'GitHub') {
            return 'github-icon.svg';
        }

        if (connector.type === 'Slack') {
            return 'slack-icon.svg';
        }

        if (connector.type === 'Teams') {
            return 'teams-icon.svg';
        }

        throw new Error(
            `Not know connector type: "${(connector as any).type}"`
        );
    }
}
