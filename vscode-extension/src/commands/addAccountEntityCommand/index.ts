import { AccountTreeItem } from '../../activityBar/accounts/AccountTreeItem';
import { addGitHubAccountEntityCommand } from './addGitHubAccountEntityCommand';
import { addTeamsAccountEntityCommand } from './addTeamsAccountEntityCommand';

/**
 * Command to add an account entity to the account:
 *  - For GitHub - a repo
 *  - For Teams - a team
 * @param treeItem - A calling tree item, if invoked from the activity bar.
 */
export const addAccountEntityCommand = async (treeItem?: AccountTreeItem) => {
    if (!treeItem) {
        throw new Error(
            `[addAccountEntityCommand]: no "account" argument set.`
        );
    }

    const { account } = treeItem;

    if (account.type === 'GitHub') {
        return await addGitHubAccountEntityCommand(account);
    }

    if (account.type === 'Teams') {
        return await addTeamsAccountEntityCommand(account);
    }

    throw new Error(`Unknown account type "${account.type}".`);
};
