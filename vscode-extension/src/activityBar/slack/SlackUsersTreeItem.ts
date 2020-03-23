import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ISlackAccountRecord } from '../../interfaces/IAccountRecord';
import { getIconPack } from '../../utils/icons';
import { TSlackAccountSubsections } from './interfaces/TSlackAccountSubsections';

export class SlackUsersTreeItem extends TreeItem {
    public type: TSlackAccountSubsections = 'Users';
    constructor(
        public itemId: string,
        public account: ISlackAccountRecord,
        label: string = 'Users'
    ) {
        super(label, TreeItemCollapsibleState.Collapsed);

        this.iconPath = getIconPack('account-icon.svg');
    }
}
