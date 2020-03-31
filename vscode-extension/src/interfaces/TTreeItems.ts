import { GitHubAccountRepoIssueTreeItem } from '../activityBar/github/GitHubAccountRepoIssueTreeItem';
import { GitHubAccountRepoTreeItem } from '../activityBar/github/GitHubAccountRepoTreeItem';
import { SlackChannelTreeItem } from '../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../activityBar/slack/SlackUserTreeItem';
import { TeamsChannelTreeItem } from '../activityBar/teams/TeamsChannelTreeItem';
import { TeamsUserTreeItem } from '../activityBar/teams/TeamsUserTreeItem';

export type TSlackTreeItems = SlackUserTreeItem | SlackChannelTreeItem;
export type TGithubTreeItems =
    | GitHubAccountRepoTreeItem
    | GitHubAccountRepoIssueTreeItem;

export type TTeamsTreeItems = TeamsUserTreeItem | TeamsChannelTreeItem;

export type TTreeItemType = TSlackTreeItems | TGithubTreeItems;
