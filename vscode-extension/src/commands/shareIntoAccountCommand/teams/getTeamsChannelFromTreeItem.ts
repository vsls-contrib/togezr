import { TeamsChannelTreeItem } from '../../../activityBar/teams/TeamsChannelTreeItem';
import { TeamsUserTreeItem } from '../../../activityBar/teams/TeamsUserTreeItem';
import { TTeamsChannel } from '../../../interfaces/TTeamsChannel';
import { TTeamsTreeItems } from '../../../interfaces/TTreeItems';

// type TShareIntoTreeItem = SlackUserTreeItem | SlackChannelTreeItem;
// type TShareIntoSlackTreeItem = SlackUserTreeItem | SlackChannelTreeItem;

const getChannelFromTeamsTreeitem = (item: TTeamsTreeItems): TTeamsChannel => {
    if (item instanceof TeamsUserTreeItem) {
        return {
            type: 'teams-user',
            // team: item.team,
            user: item.user,
            account: item.account,
        };
    }

    if (item instanceof TeamsChannelTreeItem) {
        return {
            type: 'teams-channel',
            channel: item.channel,
            team: item.team,
            account: item.account,
        };
    }

    throw new Error('Unknown Teams tree item.');
};

const isTeamsTreeItem = (item: TTeamsTreeItems): boolean => {
    return (
        item instanceof TeamsUserTreeItem ||
        item instanceof TeamsChannelTreeItem
    );
};

export const getTeamsChannelFromTreeItem = (
    item: TTeamsTreeItems
): TTeamsChannel => {
    if (isTeamsTreeItem(item)) {
        return getChannelFromTeamsTreeitem(item);
    }

    throw new Error('Unknown Teams tree item.');
};
