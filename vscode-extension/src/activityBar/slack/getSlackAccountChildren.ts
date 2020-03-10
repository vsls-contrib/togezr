import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { getSlackAPI } from '../../slack/api';
import { ISlackChannelsWebCallResult } from './interfaces/ISlackChannelsWebCallResult';
import { ISlackUsersWebCallResult } from './interfaces/ISlackUsersWebCallResult';
import { slackAccountCache } from './slackAccountCache';
import { SlackChannelsTreeItem } from './SlackChannelsTreeItem';
import { SlackUsersTreeItem } from './SlackUsersTreeItem';
export const getSlackAccountChildren = async (account: IAccountRecord) => {
    const { name } = account;
    const api = await getSlackAPI(name);
    const result = [];
    const [usersResponse, channelResponse] = await Promise.all<
        ISlackUsersWebCallResult,
        ISlackChannelsWebCallResult
    >([api.users.list(), api.channels.list()]);
    const { members = [] } = usersResponse;
    const { channels = [] } = channelResponse;
    const users = members.filter(
        (m) => !m.deleted && !m.is_bot && !m.is_app_user
    );
    const cleanChannles = channels.filter(
        (ch) => !ch.unlinked && !ch.is_archived
    );
    slackAccountCache[name] = {
        users,
        channels: cleanChannles,
    };
    if (users.length) {
        const usersTreeItem = new SlackUsersTreeItem(name);
        result.push(usersTreeItem);
    }
    if (users.length) {
        const channelsTreeItem = new SlackChannelsTreeItem(name);
        result.push(channelsTreeItem);
    }
    return result;
};
