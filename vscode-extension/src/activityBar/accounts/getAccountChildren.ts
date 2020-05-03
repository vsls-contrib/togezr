import { getGithubAccountChildren } from '../github/getGithubAccountChildren';
import { getSlackAccountChildren } from '../slack/getSlackAccountChildren';
import { getTeamsAccountChildren } from '../teams/getTeamsAccountChildren';
import { AccountTreeItem } from './AccountTreeItem';

export const getAccountChildren = async (element: AccountTreeItem) => {
    const { account } = element;

    switch (account.type) {
        case 'GitHub': {
            return await getGithubAccountChildren(account, element);
        }

        case 'Slack': {
            return await getSlackAccountChildren(account);
        }

        case 'Teams': {
            return await getTeamsAccountChildren(account);
        }

        default: {
            throw new Error(`Unknown account type "${(account as any).type}".`);
        }
    }
};
