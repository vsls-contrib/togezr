import { GitHubAccountRepoIssueTreeItem } from '../../../activityBar/github/GitHubAccountRepoIssueTreeItem';
import { GITHUB_REPO_ISSUE_CHANNEL_TYPE } from '../../../constants';
export const getGitHubChannelFromTreeItem = (
    item: GitHubAccountRepoIssueTreeItem
) => {
    if (!(item instanceof GitHubAccountRepoIssueTreeItem)) {
        throw new Error(`UnknoWN GitHub activity bar item.`);
    }

    return {
        type: GITHUB_REPO_ISSUE_CHANNEL_TYPE as typeof GITHUB_REPO_ISSUE_CHANNEL_TYPE,
        repo: item.repo,
        issue: item.issue,
        account: item.account,
        id: `${item.repo.id}_${item.issue.id}_${item.account.name}`,
    };
};
