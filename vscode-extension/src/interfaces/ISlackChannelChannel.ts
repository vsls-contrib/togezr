import { SLACK_CHANNEL_CHANNEL_TYPE } from '../commands/shareIntoAccountCommand/shareIntoAccountCommand';
import { IChannel } from './IChannel';
import { ISlackChannel } from './ISlackChannel';
export interface ISlackChannelChannel extends IChannel {
    type: typeof SLACK_CHANNEL_CHANNEL_TYPE;
    channel: ISlackChannel;
}
