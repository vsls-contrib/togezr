import { Octokit } from '@octokit/rest';
import { accountsKeychain } from '../accounts/accountsKeychain';

const cache = new Map<string, Octokit>();

export const getGithubAPI = async (accountName: string) => {
    const existingApi = cache.get(accountName);

    if (existingApi) {
        return existingApi;
    }

    const account = await accountsKeychain.getAccount(accountName);

    if (!account) {
        throw new Error(`No "${accountName}" found.`);
    }

    const webApi = new Octokit({
        auth: account.token,
        userAgent: 'togezr vscode extension v0.1.0',
    });

    cache.set(accountName, webApi);

    return webApi;
};
