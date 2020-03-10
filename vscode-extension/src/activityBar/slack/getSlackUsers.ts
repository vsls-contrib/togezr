import { slackAccountCache } from './slackAccountCache';
import { SlackUsersTreeItem } from './SlackUsersTreeItem';
import { SlackUserTreeItem } from './SlackUserTreeItem';

export const getSlackUsers = (
    element: SlackUsersTreeItem
): SlackUserTreeItem[] => {
    const cache = slackAccountCache[element.itemId];
    if (!cache) {
        throw new Error('No slack cached record found.');
    }
    const { users } = cache;
    const result = users.map((user) => {
        const userItem = new SlackUserTreeItem(user);
        return userItem;
    });
    return result;
};
