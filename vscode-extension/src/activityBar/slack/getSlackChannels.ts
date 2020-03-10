import { slackAccountCache } from './slackAccountCache';
import { SlackChannelsTreeItem } from './SlackChannelsTreeItem';
import { SlackChannelTreeItem } from './SlackChannelTreeItem';

export const getSlackChannels = (
    element: SlackChannelsTreeItem
): SlackChannelTreeItem[] => {
    const cache = slackAccountCache[element.itemId];
    if (!cache) {
        throw new Error('No slack cached record found.');
    }
    const { channels } = cache;
    const result = channels.map((channel) => {
        const channelItem = new SlackChannelTreeItem(channel);
        return channelItem;
    });
    return result;
};
