import fetch from 'node-fetch';

export const sendGithubRequest = async <T>(
    token: string,
    url: string,
    method: 'GET' | 'POST' | 'PATCH',
    body?: object,
    headers: { [key: string]: string } = {}
) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${token}`,
            ...headers,
        },
    };
    if (body) {
        (options as any).body = JSON.stringify(body, null, 2);
    }
    const response = await fetch(url, options);
    const result = await response.json();

    if (
        (result as any).message === 'Not Found' ||
        (result as any).message === 'Bad credentials'
    ) {
        throw new Error('GitHub request failed');
    }

    return result as T;
};
