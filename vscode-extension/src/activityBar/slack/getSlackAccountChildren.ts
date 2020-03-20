import { getUsersWithIms } from '../../commands/shareIntoAccountCommand/getUsersWithIms';
import { ISlackAccountRecord } from '../../interfaces/IAccountRecord';
import { ISlackImsWebCallResult } from '../../interfaces/ISlackUserWithIM';
import { getSlackAPI } from '../../slack/api';
import { ISlackChannelsWebCallResult } from './interfaces/ISlackChannelsWebCallResult';
import { ISlackUsersWebCallResult } from './interfaces/ISlackUsersWebCallResult';
import { slackAccountCache } from './slackAccountCache';
import { SlackChannelsTreeItem } from './SlackChannelsTreeItem';
import { SlackUsersTreeItem } from './SlackUsersTreeItem';

export const getSlackAccountChildren = async (account: ISlackAccountRecord) => {
    const { name } = account;

    const api = await getSlackAPI(name);

    const result = [];

    const [usersResponse, imsResponse, channelResponse] = await Promise.all<
        ISlackUsersWebCallResult,
        ISlackImsWebCallResult,
        ISlackChannelsWebCallResult
    >([api.users.list(), api.im.list(), api.channels.list()]);

    const { members = [] } = usersResponse;
    const { channels = [] } = channelResponse;
    const { ims = [] } = imsResponse;

    const existingUsers = members.filter(
        (m) => !m.deleted && !m.is_bot && !m.is_app_user
    );

    const users = getUsersWithIms(existingUsers, ims);

    const cleanChannels = channels.filter((ch) => {
        return !ch.unlinked && !ch.is_archived;
    });

    slackAccountCache[name] = {
        users,
        channels: cleanChannels,
    };

    if (users.length) {
        const usersTreeItem = new SlackUsersTreeItem(name, account);
        result.push(usersTreeItem);
    }

    if (users.length) {
        const channelsTreeItem = new SlackChannelsTreeItem(name, account);
        result.push(channelsTreeItem);
    }
    return result;
};
