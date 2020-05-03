import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ITeamsAccountRecord } from '../../interfaces/IAccountRecord';
import { TreeItemContext } from '../../sessionConnectors/constants';
import { getIconPack } from '../../utils/icons';
export class TeamsTeamsTreeItem extends TreeItem {
    constructor(public account: ITeamsAccountRecord) {
        super('Teams', TreeItemCollapsibleState.Expanded);

        this.tooltip = 'Teams';
        this.contextValue = TreeItemContext.TeamsTeamsTreeItem;
        this.iconPath = getIconPack('team-icon.svg');
    }
}
