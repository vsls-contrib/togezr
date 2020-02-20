import * as vscode from 'vscode';
import {
    BranchGithubConnectionConnectorTreeItem,
    BranchSlackConnectionConnectorTreeItem,
    BranchTeamsConnectionConnectorTreeItem,
    ConnectorTreeItem,
} from '../../activityBar/activityBar';
import {
    connectorRepository,
    ISlackConnector,
} from '../../connectorRepository/connectorRepository';
import { IGithubConnectorData } from '../../interfaces/IGithubConnectorData';
import { ISlackConnectionData } from '../../interfaces/ISlackConnectionData';

const getSlackTeamUrl = (id: string) => {
    return `https://app.slack.com/client/${id}`;
};

const openSlackChannel = async (
    item: BranchSlackConnectionConnectorTreeItem
) => {
    const { channel } = item.connectorData.data as ISlackConnectionData;

    const connector = connectorRepository.getConnector(
        item.connectorData.id
    ) as ISlackConnector;

    if (!connector) {
        throw new Error('No connector found.');
    }

    const url = `${getSlackTeamUrl(connector.team.id)}/${channel.id}`;
    await vscode.env.openExternal(vscode.Uri.parse(url));
};

const openGithubChannel = async (
    item: BranchTeamsConnectionConnectorTreeItem
) => {
    const { githubIssue } = item.connectorData.data as IGithubConnectorData;

    if (!githubIssue) {
        throw new Error('No githubIssue found.');
    }

    await vscode.env.openExternal(vscode.Uri.parse(githubIssue.html_url));
};

export const openInBrowserCommand = async (
    item?:
        | BranchGithubConnectionConnectorTreeItem
        | BranchSlackConnectionConnectorTreeItem
) => {
    if (!item) {
        return;
    }

    if (item.connectorData.type === 'GitHub') {
        return await openGithubChannel(item);
    }

    if (item.connectorData.type === 'Slack') {
        return await openSlackChannel(item);
    }
};

export const openConnectorInBrowserCommand = async (
    item?: ConnectorTreeItem
) => {
    if (!item) {
        return;
    }

    const { connector } = item;

    if (connector.type === 'GitHub') {
        return await vscode.env.openExternal(
            vscode.Uri.parse(connector.repo.html_url)
        );
    }

    if (connector.type === 'Slack') {
        return await vscode.env.openExternal(
            vscode.Uri.parse(getSlackTeamUrl(connector.team.id))
        );
    }
};
