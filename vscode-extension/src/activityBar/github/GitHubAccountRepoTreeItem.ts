import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { IGithubRepo } from '../../interfaces/IGitHubRepo';
import { TreeItemContext } from '../../sessionConnectors/constants';
import { getIconPack } from '../../utils/icons';

export class GitHubAccountRepoTreeItem extends TreeItem {
    constructor(
        public account: IGitHubAccountRecord,
        public repo: IGithubRepo
    ) {
        super(repo.name, TreeItemCollapsibleState.Expanded);

        const stars = `[✭ ${repo.stargazers_count}]`;

        this.description = `${stars} ${this.repo.description}`;

        this.tooltip = this.repo.description
            ? `${this.label} • ${this.description}`
            : this.label;

        this.iconPath = getIconPack('repo-icon.svg');
        this.contextValue = TreeItemContext.GitHubAccountRepoTreeItem;
    }
}
