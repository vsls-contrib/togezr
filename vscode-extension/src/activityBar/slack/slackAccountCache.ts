import { ISlackAccountCache } from './interfaces/ISlackAccountCache';
export let slackAccountCache: ISlackAccountCache = {};

export const resetSlackAccountCache = () => {
    slackAccountCache = {};
};
