import * as vscode from 'vscode';
import { getCurrentBranch, switchToTheBranch } from '../../branchBroadcast/git';
import { startLiveShareSession } from '../../branchBroadcast/liveshare';
import { registerBranch } from './branchRegistry';
import {
    addChannel,
    getChannels,
    IChannelRegistryData,
} from './channelsRegistry';

class CancellationError extends Error {}

export const registerTheBranchAndAskToSwitch = async (
    repoId: string,
    branchName: string,
    githubIssue: string,
    channel: IChannelRegistryData
) => {
    await registerBranch({
        branchName,
        githubIssue,
        channel,
        repoId,
    });

    const currentBranch = getCurrentBranch();
    const buttonPrefix =
        !currentBranch || currentBranch.name !== branchName ? 'Switch & ' : '';
    const startButton = `${buttonPrefix}Start Broadcasting`;
    const answer = await vscode.window.showInformationMessage(
        `The *${branchName}* was successfully registered for broadcast.`,
        startButton
    );
    if (answer === startButton) {
        await switchToTheBranch(branchName);
        await startLiveShareSession(branchName);
    }
};

const askForChannel = async (): Promise<string> => {
    const channelsData = getChannels();

    const ADD_NEW_LABEL = 'Add new';
    channelsData.channels.push({ url: '', name: 'Add new' });

    const options: (vscode.QuickPickItem & {
        url: string;
    })[] = channelsData.channels.map((ch) => {
        return {
            label: ch.name,
            url: ch.url,
        };
    });

    const channel = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select Slack channel for broadcast',
        // BRANCH_BROADCAST_TODO: enable multiple channel broadcast
        // canPickMany: true
    });

    if (channel?.label === ADD_NEW_LABEL) {
        const channel = await vscode.window.showInputBox({
            prompt:
                'Provide Slack channel in the next format: Channel1 @ https://webhook.io',
        });

        if (!channel) {
            return await askForChannel();
        }

        const [maybeName = '', maybeUrl = ''] = channel.split('@');

        const name = maybeName.trim();
        const url = maybeUrl.trim();

        if (!name || !url) {
            throw new CancellationError(
                'No channel provided or the format is wrong.'
            );
        }

        addChannel(name, url);

        return url;
    }

    if (!channel) {
        throw new Error('No channel selected.');
    }

    return channel.url;
};

export const startRegisteringTheBranch = async (
    repoId: string,
    branchName: string
) => {
    const issue = await vscode.window.showInputBox({
        prompt: 'Add GitHub issue',
        ignoreFocusOut: true,
    });

    /**
     * BRANCH_BROADCAST_TODO: Validate the GH issue.
     */

    if (!issue) {
        throw new CancellationError('No issue provided.');
    }

    // const channel = await askForChannel();
    // if (!channel) {
    //     throw new CancellationError('No channel provided.');
    // }
    // const channelRecord = getChannelByUrl(channel);
    // if (!channelRecord) {
    //     throw new Error('No channel record found');
    // }

    const channelRecord = {
        url: '',
        name: '',
    };

    await registerTheBranchAndAskToSwitch(
        repoId,
        branchName,
        issue,
        channelRecord
    );
};
