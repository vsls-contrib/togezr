import { LogLevel, WebClient } from '@slack/web-api';
import { accountsKeychain } from '../accounts/accountsKeychain';

const MAX_REQUEST_CONCURRENCY = 5;

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
        maxRequestConcurrency: MAX_REQUEST_CONCURRENCY,
    });

    cache.set(accountName, webApi);

    return webApi;
};

export const getSlackAPIByToken = async (token: string) => {
    const webApi = new WebClient(token, {
        logLevel: LogLevel.DEBUG,
        maxRequestConcurrency: MAX_REQUEST_CONCURRENCY,
    });

    return webApi;
};
