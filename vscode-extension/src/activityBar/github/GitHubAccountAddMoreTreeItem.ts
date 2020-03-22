import { TreeItem } from 'vscode';
import { CommandId } from '../../commands/registerCommand';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';

export class GitHubAccountAddMoreTreeItem extends TreeItem {
    constructor(label: string, account: IGitHubAccountRecord) {
        super(label);
        this.command = {
            title: label,
            command: CommandId.addGitHubAccountRepo,
            tooltip: label,
            arguments: [account],
        };
    }
}
