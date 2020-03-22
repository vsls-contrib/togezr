import { GitHubAccountRepoIssueTreeItem } from './GitHubAccountRepoIssueTreeItem';
import { GitHubAccountRepoTreeItem } from './GitHubAccountRepoTreeItem';
import { gitHubIssuesRetriever } from './GitHubIssuesRetriever';

export const getGitHubRepoIssues = async (
    element: GitHubAccountRepoTreeItem
) => {
    const { account, repo } = element;
    const issues = await gitHubIssuesRetriever.getIssues(account, repo);
    const treeItems = issues.map((issue) => {
        return new GitHubAccountRepoIssueTreeItem(repo, issue);
    });
    return treeItems;
};
