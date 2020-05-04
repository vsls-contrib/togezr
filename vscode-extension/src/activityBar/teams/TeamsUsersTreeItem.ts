import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ITeamsAccountRecord } from '../../interfaces/IAccountRecord';
import { TreeItemContext } from '../../sessionConnectors/constants';
import { getIconPack } from '../../utils/icons';

export class TeamsUsersTreeItem extends TreeItem {
    constructor(public account: ITeamsAccountRecord) {
        super('Users', TreeItemCollapsibleState.Collapsed);

        this.tooltip = 'Teams Users';
        this.contextValue = TreeItemContext.TeamsUsersTreeItem;
        this.iconPath = getIconPack('account-icon.svg');
    }
}
