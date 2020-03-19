import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { getIconPack } from '../../utils/icons';
import { TSlackAccountSubsections } from './interfaces/TSlackAccountSubsections';
export class SlackChannelsTreeItem extends TreeItem {
    public type: TSlackAccountSubsections = 'Channels';

    constructor(
        public itemId: string,
        public account: IAccountRecord,
        label: string = 'Channels'
    ) {
        super(label, TreeItemCollapsibleState.Expanded);
        this.iconPath = getIconPack('hash-icon.svg');
    }
}
