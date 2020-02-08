import fetch from 'node-fetch';
import * as memento from '../../memento';
import { DEFAULT_GITHUB_AVATAR } from './constants';

const GITHUB_AVATARS_CACHE_PREFIX = 'togezr.github.avatars.cache';

interface ICachedAvatarLink {
    link: string;
    lastUpdate: number;
}

// 5 days
const CACHE_UPDATE_THRESHOLD_MS = 5 * 24 * 60 * 60 * 1000;

const isValidCacheRecod = (cachedRecord: ICachedAvatarLink) => {
    const lastUpdate = new Date(parseInt(`${cachedRecord.lastUpdate}`, 10));
    const delta = Date.now() - lastUpdate.getTime();

    return delta < CACHE_UPDATE_THRESHOLD_MS;
};

export class GithubAvatarRepository {
    public async getAvatarFor(username: string): Promise<string> {
        const cachedAvatarLink = memento.get<ICachedAvatarLink>(
            `${GITHUB_AVATARS_CACHE_PREFIX}.${username}`
        );

        if (cachedAvatarLink && isValidCacheRecod(cachedAvatarLink)) {
            return cachedAvatarLink.link;
        }

        try {
            const response = await fetch(
                `https://api.github.com/users/${username}`
            );

            const result = await response.json();
            const avatar = result['avatar_url'];

            if (!avatar) {
                return DEFAULT_GITHUB_AVATAR;
            }

            const record: ICachedAvatarLink = {
                link: avatar,
                lastUpdate: Date.now(),
            };

            memento.set(`${GITHUB_AVATARS_CACHE_PREFIX}.${username}`, record);

            return avatar;
        } catch {
            return DEFAULT_GITHUB_AVATAR;
        }
    }
}

export const githubAvatarRepository = new GithubAvatarRepository();
