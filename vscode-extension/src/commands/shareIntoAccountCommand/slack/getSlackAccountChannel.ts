import * as vscode from 'vscode';
import { accountsKeychain } from '../../../accounts/accountsKeychain';
import { ISlackChannelsWebCallResult } from '../../../activityBar/slack/interfaces/ISlackChannelsWebCallResult';
import { CancellationError } from '../../../errors/CancellationError';
import {
    ISlackImsWebCallResult,
    ISlackUsersWebCallResult,
} from '../../../interfaces/ISlackUserWithIM';
import { TSlackChannel } from '../../../interfaces/TSlackChannel';
import { getSlackAPI } from '../../../slack/slackAPI';
import { getSlackChannelChannel } from './getSlackChannelChannel';
import { getSlackUserChannel } from './getSlackUserChannel';

export const getSlackAccountChannel = async (
    accountName: string
): Promise<TSlackChannel | undefined> => {
    const api = await getSlackAPI(accountName);

    const [usersResponse, imsResponse, channelsResponse] = await Promise.all<
        any,
        any,
        any
    >([api.users.list(), api.im.list(), api.channels.list()]);

    const users = usersResponse as ISlackUsersWebCallResult;
    const ims = imsResponse as ISlackImsWebCallResult;
    const channelsWebResponse = channelsResponse as ISlackChannelsWebCallResult;
    const { channels = [] } = channelsWebResponse;
    const channelOptions = [];
    const USER_LABEL = 'User';
    const CHANNELS_LABEL = 'Channels';

    api.users.getPresence({
        user: users.members[0].id,
    });

    if (users.ok && users.members.length) {
        channelOptions.push(USER_LABEL);
    }

    if (channelsWebResponse.ok && channels.length) {
        channelOptions.push(CHANNELS_LABEL);
    }
    const answer = await vscode.window.showQuickPick(channelOptions, {
        ignoreFocusOut: true,
        placeHolder: 'Where do you want to post?',
    });
    if (!answer) {
        throw new CancellationError('No channel selected.');
    }
    if (answer === USER_LABEL) {
        const userForChannel = await getSlackUserChannel(
            users.members,
            ims.ims || []
        );
        const account = await accountsKeychain.getAccount(accountName);
        if (!account) {
            throw new Error(
                `No account found for channel "${userForChannel.real_name}"`
            );
        }
        return {
            type: 'slack-user',
            user: userForChannel,
            account,
            id: `slack_${userForChannel.team_id}_ ${userForChannel.id}`,
        };
    }
    if (answer === CHANNELS_LABEL) {
        const selectedChannel = await getSlackChannelChannel(channels);
        const account = await accountsKeychain.getAccount(accountName);
        if (!account) {
            throw new Error(
                `No account found for channel "${selectedChannel.name}"`
            );
        }
        return {
            type: 'slack-channel',
            channel: selectedChannel,
            account,
            id: `slack_channel_${selectedChannel.id}`,
        };
    }
};
