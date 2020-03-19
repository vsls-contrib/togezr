import { TreeItem } from 'vscode';
import { TreeItemContext } from '../sessionConnectors/constants';
export class ShareIntoTreeItem extends TreeItem {
    public contextValue = TreeItemContext.ShareIntoTreeItem;
}
