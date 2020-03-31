import { TreeItem } from 'vscode';
import { ITeamsAccountRecord } from '../../interfaces/IAccountRecord';
import { ITeamsChannel } from '../../interfaces/ITeamsChannel';
import { TreeItemContext } from '../../sessionConnectors/constants';
import { ITeamsTeam } from '../../teams/teamsTeamsRepository';

export class TeamsChannelTreeItem extends TreeItem {
    constructor(
        public team: ITeamsTeam,
        public channel: ITeamsChannel,
        public account: ITeamsAccountRecord
    ) {
        super(`#${channel.displayName}`);

        this.description = channel.description;
        this.tooltip = this.description
            ? `${this.label} • ${this.description}`
            : this.label;

        this.contextValue = TreeItemContext.ShareIntoTreeItem;
    }
}
