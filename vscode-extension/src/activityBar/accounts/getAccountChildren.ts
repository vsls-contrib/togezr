import { getSlackAccountChildren } from '../slack/getSlackAccountChildren';
import { AccountTreeItem } from './AccountTreeItem';

export const getAccountChildren = async (element: AccountTreeItem) => {
    const { account } = element;

    switch (element.account.type) {
        case 'Slack':
        default: {
            return await getSlackAccountChildren(account);
        }
    }
};
