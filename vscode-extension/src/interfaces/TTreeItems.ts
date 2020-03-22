import { GitHubAccountRepoIssueTreeItem } from '../activityBar/github/GitHubAccountRepoIssueTreeItem';
import { GitHubAccountRepoTreeItem } from '../activityBar/github/GitHubAccountRepoTreeItem';
import { SlackChannelTreeItem } from '../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../activityBar/slack/SlackUserTreeItem';

export type TSlackTreeItems = SlackUserTreeItem | SlackChannelTreeItem;
export type TGithubTreeItems =
    | GitHubAccountRepoTreeItem
    | GitHubAccountRepoIssueTreeItem;

export type TTreeItemType = TSlackTreeItems | TGithubTreeItems;
