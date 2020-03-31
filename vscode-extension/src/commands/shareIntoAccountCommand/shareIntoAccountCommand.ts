import * as vscode from 'vscode';
import { GitHubAccountRepoIssueTreeItem } from '../../activityBar/github/GitHubAccountRepoIssueTreeItem';
import { SlackChannelTreeItem } from '../../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../../activityBar/slack/SlackUserTreeItem';
import { TeamsChannelTreeItem } from '../../activityBar/teams/TeamsChannelTreeItem';
import { TeamsUserTreeItem } from '../../activityBar/teams/TeamsUserTreeItem';
import { TSlackTreeItems, TTeamsTreeItems } from '../../interfaces/TTreeItems';
import { shareIntoGitHubIssueChannel } from './github/shareIntoGitHubIssueChannel';
import { shareIntoSlackChannel } from './slack/shareIntoSlackChannel';
import { shareIntoTeamsChannel } from './teams/shareIntoTeamsChannel';

export const shareIntoAccountCommand = async (
    item?: TSlackTreeItems | GitHubAccountRepoIssueTreeItem | TTeamsTreeItems
) => {
    if (!vscode.workspace.rootPath) {
        throw new Error('Please open a project to share.');
    }

    /**
     * TODO: Add a setting for the session the defaults
     */
    // const READ_ONLY_BUTTON = 'Read-only session';
    // const sessionReadOnlyAnswer = await vscode.window.showQuickPick(
    //     ['Read/Write session', READ_ONLY_BUTTON],
    //     {
    //         placeHolder: 'Select session type',
    //         ignoreFocusOut: true,
    //     }
    // );
    // if (!sessionReadOnlyAnswer) {
    //     throw new CancellationError('No session type selected.');
    // }
    // const isReadOnlySession = sessionReadOnlyAnswer === READ_ONLY_BUTTON;
    const isReadOnlySession = true;

    if (
        item instanceof SlackChannelTreeItem ||
        item instanceof SlackUserTreeItem
    ) {
        return await shareIntoSlackChannel(item, isReadOnlySession);
    }

    if (item instanceof GitHubAccountRepoIssueTreeItem) {
        return await shareIntoGitHubIssueChannel(item, isReadOnlySession);
    }

    if (
        item instanceof TeamsUserTreeItem ||
        item instanceof TeamsChannelTreeItem
    ) {
        return await shareIntoTeamsChannel(item, isReadOnlySession);
    }
};
