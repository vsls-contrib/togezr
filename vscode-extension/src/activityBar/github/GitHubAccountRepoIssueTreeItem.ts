import { IGithubRepo } from '../../interfaces/IGitHubRepo';
import { IShortGitHubIssue } from '../../interfaces/IShortGitHubIssue';
import { getIconPack } from '../../utils/icons';
import { ShareIntoTreeItem } from '../ShareIntoTreeItem';

export class GitHubAccountRepoIssueTreeItem extends ShareIntoTreeItem {
    constructor(public repo: IGithubRepo, public issue: IShortGitHubIssue) {
        super(issue.title);
        this.description = `@${issue.user.login}`;
        this.iconPath = getIconPack('issue-icon.svg');
    }
}
