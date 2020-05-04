import { TChannel } from '../interfaces/TChannel';
import { getChannelSessionClass } from './shareIntoChannels';

export const shareIntoChannel = async (
    channel: TChannel,
    sessionId?: string
) => {
    // restrict to GitHub issues channel for now
    if (channel.type !== 'github-issue') {
        throw new Error(
            'Unknown channel (only GitHub issue channels supported at the moment).'
        );
    }
    const ChannelClass = getChannelSessionClass(channel);
    const session = new ChannelClass(channel, [], sessionId);
    await session.init();

    return session.sessionId;
};
