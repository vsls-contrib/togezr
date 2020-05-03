import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { IShortGithubRepo } from '../../interfaces/IGitHubRepo';
import { IShortGitHubIssue } from '../../interfaces/IShortGitHubIssue';
import { getIconPack } from '../../utils/icons';
import { ShareIntoTreeItem } from '../ShareIntoTreeItem';

export class GitHubAccountRepoIssueTreeItem extends ShareIntoTreeItem {
    constructor(
        public account: IAccountRecord,
        public repo: IShortGithubRepo,
        public issue: IShortGitHubIssue
    ) {
        super(issue.title);
        this.description = `@${issue.user.login}`;
        this.iconPath = getIconPack('issue-icon.svg');
    }
}
