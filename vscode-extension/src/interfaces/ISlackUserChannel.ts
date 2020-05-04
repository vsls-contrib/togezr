import { IChannel } from './IChannel';
import { ISlackUserWithIM } from './ISlackUserWithIM';
import { TSlackUserChannelType } from './TSlackChannel';

export interface ISlackUserChannel extends IChannel {
    type: TSlackUserChannelType;
    user: ISlackUserWithIM;
}
