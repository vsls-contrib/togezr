import { TreeItem } from 'vscode';
import { CommandId } from '../../commands/registerCommand';
import { AccountTreeItem } from './AccountTreeItem';

export class AccountAddMoreTreeItem extends TreeItem {
    constructor(label: string, element: AccountTreeItem) {
        super(label);

        this.command = {
            title: label,
            command: CommandId.addAccountEntity,
            tooltip: label,
            arguments: [element],
        };
    }
}
