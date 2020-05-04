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
        throw new Error(`No account "${accountName}" found.`);
    }

    const webApi = new Octokit({
        auth: account.token,
        userAgent: 'togezr vscode extension v0.1.0',
    });

    cache.set(accountName, webApi);

    return webApi;
};

export const getGithubAPIbyToken = async (token: string) => {
    const existingApi = cache.get(token);

    if (existingApi) {
        return existingApi;
    }

    const webApi = new Octokit({
        auth: token,
        userAgent: 'togezr vscode extension v0.1.0',
    });

    cache.set(token, webApi);

    return webApi;
};
