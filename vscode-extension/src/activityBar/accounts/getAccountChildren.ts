import { getGithubAccountChildren } from '../github/getGithubAccountChildren';
import { getSlackAccountChildren } from '../slack/getSlackAccountChildren';
import { AccountTreeItem } from './AccountTreeItem';

export const getAccountChildren = async (element: AccountTreeItem) => {
    const { account } = element;

    switch (account.type) {
        case 'Slack': {
            return await getSlackAccountChildren(account);
        }

        case 'GitHub': {
            return await getGithubAccountChildren(account, element);
        }

        default: {
            throw new Error(`Unknown account type "${account.type}".`);
        }
    }
};
