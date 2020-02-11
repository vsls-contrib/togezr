import fetch from 'node-fetch';
import { getAuthToken } from './githubSessionReporter';

export const sendGithubRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PATCH',
    body?: object
) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${await getAuthToken()}`,
        },
    };
    if (body) {
        (options as any).body = JSON.stringify(body, null, 2);
    }
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
};
