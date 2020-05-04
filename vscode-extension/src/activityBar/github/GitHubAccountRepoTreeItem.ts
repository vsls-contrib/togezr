import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { IShortGithubRepo } from '../../interfaces/IGitHubRepo';
import { TreeItemContext } from '../../sessionConnectors/constants';
import { getIconPack } from '../../utils/icons';

export class GitHubAccountRepoTreeItem extends TreeItem {
    constructor(
        public account: IGitHubAccountRecord,
        public repo: IShortGithubRepo
    ) {
        super(repo.name, TreeItemCollapsibleState.Collapsed);

        const stars = `[✭ ${repo.stargazers_count}]`;

        this.description = `${stars} ${this.repo.description}`;

        this.tooltip = this.repo.description
            ? `${this.label} • ${this.description}`
            : this.label;

        this.iconPath = getIconPack('repo-icon.svg');
        this.contextValue = TreeItemContext.GitHubAccountRepoTreeItem;
    }
}
