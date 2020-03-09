import { LogLevel, WebClient } from '@slack/web-api';
import { accountsKeychain } from '../accounts/accountsKeychain';

const cache = new Map<string, WebClient>();

export const getSlackAPI = async (accountName: string) => {
    const existingApi = cache.get(accountName);

    if (existingApi) {
        return existingApi;
    }

    const account = await accountsKeychain.getAccount(accountName);

    if (!account) {
        throw new Error(`No "${accountName}" found.`);
    }

    const webApi = new WebClient(account.token, {
        logLevel: LogLevel.DEBUG,
        maxRequestConcurrency: 3,
    });

    cache.set(accountName, webApi);

    return webApi;
};
