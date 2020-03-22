import { IChannel } from './IChannel';
import { ISlackChannel } from './ISlackChannel';
import { TSlackChannelChannelType } from './TSlackChannel';

export interface ISlackChannelChannel extends IChannel {
    type: TSlackChannelChannelType;
    channel: ISlackChannel;
}
