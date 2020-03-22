import { TreeItem } from 'vscode';
import { CommandId } from '../../commands/registerCommand';
import { AccountTreeItem } from '../accounts/AccountTreeItem';

export class GitHubAccountAddMoreTreeItem extends TreeItem {
    constructor(label: string, element: AccountTreeItem) {
        super(label);
        this.command = {
            title: label,
            command: CommandId.addGitHubAccountRepo,
            tooltip: label,
            arguments: [element],
        };
    }
}
