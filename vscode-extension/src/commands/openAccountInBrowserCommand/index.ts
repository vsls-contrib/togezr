import * as vscode from 'vscode';
import { SlackChannelTreeItem } from '../../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../../activityBar/slack/SlackUserTreeItem';

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

export const openAccountInBrowserCommand = async (
    item: SlackUserTreeItem | SlackChannelTreeItem
) => {
    if (item instanceof SlackUserTreeItem) {
        return await openSlackUserInBrowser(item);
    }

    if (item instanceof SlackChannelTreeItem) {
        return await openSlackChannelInBrowser(item);
    }

    throw new Error('Unknown tree item to open account in browser.');
};
