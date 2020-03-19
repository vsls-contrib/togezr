import * as vscode from 'vscode';
import { SlackChannelTreeItem } from '../../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../../activityBar/slack/SlackUserTreeItem';
import { lsApi, startLSSession } from '../../branchBroadcast/liveshare';
import { SlackChannelSession } from '../../channels/SlackChannelSession';
import { CancellationError } from '../../errors/CancellationError';
import { askUserForChannel } from './askUserForChannel';
import { getChannelFromTreeItem } from './getChannelFromTreeItem';

export const SLACK_USER_CHANNEL_TYPE = 'slack-user';
export const SLACK_CHANNEL_CHANNEL_TYPE = 'slack-channel';

export const shareIntoAccountCommand = async (
    item?: SlackUserTreeItem | SlackChannelTreeItem
) => {
    if (!vscode.workspace.rootPath) {
        throw new Error('Please open a project to share.');
    }

    const READ_ONLY_BUTTON = 'Read-only session';
    const sessionReadOnlyAnswer = await vscode.window.showQuickPick(
        ['Read/Write session', READ_ONLY_BUTTON],
        {
            placeHolder: 'Select session type',
            ignoreFocusOut: true,
        }
    );

    if (!sessionReadOnlyAnswer) {
        throw new CancellationError('No session type selected.');
    }

    const isReadOnlySession = sessionReadOnlyAnswer === READ_ONLY_BUTTON;

    const slackChannel = item
        ? getChannelFromTreeItem(item)
        : await askUserForChannel();

    if (!slackChannel) {
        throw new CancellationError('No slack channel found.');
    }

    const lsAPI = lsApi();
    const session = new SlackChannelSession(slackChannel, [], lsAPI);

    await startLSSession(isReadOnlySession, session.sessionId);
    await session.init();
};
