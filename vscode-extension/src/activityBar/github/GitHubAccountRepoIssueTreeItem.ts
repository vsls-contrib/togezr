import { runningSessionsRegistry } from '../../channels/RunningSessionsRegistry';
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

        this.setIcon(issue, repo);
    }

    private setIcon = (issue: IShortGitHubIssue, repo: IShortGithubRepo) => {
        const activelyRunningSession = runningSessionsRegistry.getActivelyRunningSession();

        if (!activelyRunningSession) {
            this.setDefaultIcon();
            return;
        }

        const { channel } = activelyRunningSession;
        if (channel.type !== 'github-issue') {
            this.setDefaultIcon();
            return;
        }

        if (channel.issue.id !== issue.id || channel.repo.id !== repo.id) {
            this.setDefaultIcon();
            return;
        }

        this.iconPath = getIconPack('sharing-into-issue-icon.svg');
    };

    private setDefaultIcon = () => {
        this.iconPath = getIconPack('issue-icon.svg');
    };
}
