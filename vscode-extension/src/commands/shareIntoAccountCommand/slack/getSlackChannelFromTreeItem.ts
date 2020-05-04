import { SlackChannelTreeItem } from '../../../activityBar/slack/SlackChannelTreeItem';
import { SlackUserTreeItem } from '../../../activityBar/slack/SlackUserTreeItem';
import { TSlackChannel } from '../../../interfaces/TSlackChannel';

type TShareIntoTreeItem = SlackUserTreeItem | SlackChannelTreeItem;
type TShareIntoSlackTreeItem = SlackUserTreeItem | SlackChannelTreeItem;

const getChannelFromSlackTreeitem = (
    item: TShareIntoSlackTreeItem
): TSlackChannel => {
    if (item instanceof SlackUserTreeItem) {
        return {
            type: 'slack-user',
            user: item.user,
            account: item.account,
            id: `slack_${item.user.team_id}_${item.user.id}`,
        };
    }
    if (item instanceof SlackChannelTreeItem) {
        return {
            type: 'slack-channel',
            channel: item.channel,
            account: item.account,
            id: `slack_${item.channel.id}`,
        };
    }

    throw new Error('Unknown tree item.');
};

const isSlackTreeItem = (item: TShareIntoTreeItem): boolean => {
    return (
        item instanceof SlackUserTreeItem ||
        item instanceof SlackChannelTreeItem
    );
};

export const getSlackChannelFromTreeItem = (
    item: TShareIntoTreeItem
): TSlackChannel => {
    if (isSlackTreeItem(item)) {
        return getChannelFromSlackTreeitem(item);
    }

    throw new Error('Unknown tree item.');
};
