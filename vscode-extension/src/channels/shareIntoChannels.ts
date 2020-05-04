import { startLSSession } from '../branchBroadcast/liveshare';
import { CancellationError } from '../errors/CancellationError';
import { TChannel } from '../interfaces/TChannel';
import { GitHubChannelSession } from './GitHubChannelSession';
import { shareIntoChannel } from './shareIntoChannel';

export const shareIntoChannels = async (
    channels: TChannel[],
    isReadOnlySession: boolean = false
) => {
    const channelPromises = [];
    const sessionId = await startLSSession(isReadOnlySession);
    if (!sessionId) {
        throw new CancellationError('No LiveShare session started.');
    }
    for (let channel of channels) {
        channelPromises.push(shareIntoChannel(channel, sessionId));
    }
    await Promise.all(channelPromises);

    return sessionId;
};

export const getChannelSessionClass = (channel: TChannel) => {
    // restrict to GitHub issues channel for now
    if (channel.type !== 'github-issue') {
        throw new Error('Unknown channel.');
    }
    return GitHubChannelSession;
};
