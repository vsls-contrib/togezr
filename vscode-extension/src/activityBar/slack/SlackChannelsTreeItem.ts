import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ISlackAccountRecord } from '../../interfaces/IAccountRecord';
import { getIconPack } from '../../utils/icons';
import { TSlackAccountSubsections } from './interfaces/TSlackAccountSubsections';
export class SlackChannelsTreeItem extends TreeItem {
    public type: TSlackAccountSubsections = 'Channels';

    constructor(
        public itemId: string,
        public account: ISlackAccountRecord,
        label: string = 'Channels'
    ) {
        super(label, TreeItemCollapsibleState.Collapsed);
        this.iconPath = getIconPack('hash-icon.svg');
    }
}
