import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ITeamsAccountRecord } from '../../interfaces/IAccountRecord';
import { TreeItemContext } from '../../sessionConnectors/constants';
import { ITeamsTeam } from '../../teams/teamsTeamsRepository';

export class TeamsTeamTreeItem extends TreeItem {
    constructor(public team: ITeamsTeam, public account: ITeamsAccountRecord) {
        super(team.displayName, TreeItemCollapsibleState.Collapsed);

        this.description = team.description;
        this.tooltip = this.description
            ? `${this.label} • ${this.description}`
            : this.label;

        // this.iconPath = getIconPack('team-icon.svg');

        this.contextValue = TreeItemContext.TeamsTeamTreeItem;
    }
}
