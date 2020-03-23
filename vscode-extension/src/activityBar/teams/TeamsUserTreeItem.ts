import { TreeItem } from 'vscode';
import { ITeamsAccountRecord } from '../../interfaces/IAccountRecord';
import { ITeamsUser } from '../../interfaces/ITeamsUser';
import { TreeItemContext } from '../../sessionConnectors/constants';
export class TeamsUserTreeItem extends TreeItem {
    constructor(public account: ITeamsAccountRecord, public user: ITeamsUser) {
        super(user.displayName);

        this.description = user.jobTitle;
        this.tooltip = this.description
            ? `${this.label} • ${this.description}`
            : this.label;

        this.contextValue = TreeItemContext.TeamsUserTreeItem;
    }
}
