import { getSlackAccountChildren } from '../slack/getSlackAccountChildren';
import { AccountTreeItem } from './AccountTreeItem';

export const getAccountChildren = async (element: AccountTreeItem) => {
    const { account } = element;

    switch (account.type) {
        case 'Slack': {
            return await getSlackAccountChildren(account);
        }

        default: {
            return [];
        }
    }
};
``;
