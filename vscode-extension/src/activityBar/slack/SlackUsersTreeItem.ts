import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getIconPack } from '../../utils/icons';
import { TSlackAccountSubsections } from './interfaces/TSlackAccountSubsections';

export class SlackUsersTreeItem extends TreeItem {
    public type: TSlackAccountSubsections = 'Users';
    constructor(public itemId: string, label: string = 'Users') {
        super(label, TreeItemCollapsibleState.Expanded);
        this.iconPath = getIconPack('account-icon.svg');
    }
}
