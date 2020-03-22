import * as vscode from 'vscode';
import { GitHubAccountRepoIssueTreeItem } from '../../activityBar/github/GitHubAccountRepoIssueTreeItem';
import { SlackChannelTreeItem } from '../../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../../activityBar/slack/SlackUserTreeItem';
import { lsApi, startLSSession } from '../../branchBroadcast/liveshare';
import { GitHubChannelSession } from '../../channels/GitHubChannelSession';
import { SlackChannelSession } from '../../channels/SlackChannelSession';
import { GITHUB_REPO_ISSUE_CHANNEL_TYPE } from '../../constants';
import { CancellationError } from '../../errors/CancellationError';
import { TSlackTreeItems } from '../../interfaces/TTreeItems';
import { askUserForChannel } from './askUserForChannel';
import { getSlackChannelFromTreeItem } from './getSlackChannelFromTreeItem';

const shareIntoSlackChannel = async (
    item: TSlackTreeItems,
    isReadOnlySession: boolean
) => {
    const slackChannel = item
        ? getSlackChannelFromTreeItem(item)
        : await askUserForChannel();

    if (!slackChannel) {
        throw new CancellationError('No slack channel found.');
    }

    const lsAPI = lsApi();
    const session = new SlackChannelSession(slackChannel, [], lsAPI);

    await startLSSession(isReadOnlySession, session.sessionId);
    await session.init();
};

const getGitHubChannelFromTreeItem = (item: GitHubAccountRepoIssueTreeItem) => {
    if (!(item instanceof GitHubAccountRepoIssueTreeItem)) {
        throw new Error(`UnknoWN GitHub activity bar item.`);
    }

    return {
        type: GITHUB_REPO_ISSUE_CHANNEL_TYPE as typeof GITHUB_REPO_ISSUE_CHANNEL_TYPE,
        repo: item.repo,
        issue: item.issue,
        account: item.account,
    };
};

const sleepAsync = (timeout: number) => {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
};

const shareIntoGitHubIssueChannel = async (
    item: GitHubAccountRepoIssueTreeItem,
    isReadOnlySession: boolean
) => {
    const gitHubChannel = getGitHubChannelFromTreeItem(item);

    console.log(gitHubChannel, isReadOnlySession);

    const lsAPI = lsApi();
    const session = new GitHubChannelSession(gitHubChannel, [], lsAPI);
    await startLSSession(isReadOnlySession, session.sessionId);
    await sleepAsync(1000);

    console.log(lsAPI.session);
    await session.init();
};

export const shareIntoAccountCommand = async (
    item?: TSlackTreeItems | GitHubAccountRepoIssueTreeItem
) => {
    if (!vscode.workspace.rootPath) {
        throw new Error('Please open a project to share.');
    }

    /**
     * TODO: Add a setting for the session tye defaults
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
};
