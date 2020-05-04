import * as vscode from 'vscode';
import { GitHubAccountRepoIssueTreeItem } from '../../activityBar/github/GitHubAccountRepoIssueTreeItem';
import { GitHubAccountRepoTreeItem } from '../../activityBar/github/GitHubAccountRepoTreeItem';
import { SlackChannelTreeItem } from '../../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../../activityBar/slack/SlackUserTreeItem';
import { TTreeItemType } from '../../interfaces/TTreeItems';

const openSlackUserInBrowser = async (item: SlackUserTreeItem) => {
    const { user } = item;
    const { team_id, im } = user;

    const url = `https://app.slack.com/client/${team_id}/${im.id}`;
    vscode.env.openExternal(vscode.Uri.parse(url));
};

const openSlackChannelInBrowser = async (item: SlackChannelTreeItem) => {
    const { channel, account } = item;

    if (account.type !== 'Slack') {
        throw new Error(
            `Slack tree item references non-Slack account type "${account.type}"`
        );
    }

    const { id } = channel;
    const { team } = account;

    const url = `https://app.slack.com/client/${team.id}/${id}`;
    vscode.env.openExternal(vscode.Uri.parse(url));
};

const openGitHubRepoInBrowser = async (item: GitHubAccountRepoTreeItem) => {
    const { repo } = item;

    await vscode.env.openExternal(vscode.Uri.parse(repo.html_url));
};

const openGitHubIssueInBrowser = async (
    item: GitHubAccountRepoIssueTreeItem
) => {
    const { issue } = item;

    await vscode.env.openExternal(vscode.Uri.parse(issue.html_url));
};

export const openAccountInBrowserCommand = async (item: TTreeItemType) => {
    if (item instanceof SlackUserTreeItem) {
        return await openSlackUserInBrowser(item);
    }

    if (item instanceof SlackChannelTreeItem) {
        return await openSlackChannelInBrowser(item);
    }

    if (item instanceof GitHubAccountRepoTreeItem) {
        return await openGitHubRepoInBrowser(item);
    }

    if (item instanceof GitHubAccountRepoIssueTreeItem) {
        return await openGitHubIssueInBrowser(item);
    }

    throw new Error('Unknown tree item to open account in browser.');
};
