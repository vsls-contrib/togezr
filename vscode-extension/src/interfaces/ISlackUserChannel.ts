import { SLACK_USER_CHANNEL_TYPE } from '../commands/shareIntoAccountCommand/shareIntoAccountCommand';
import { IChannel } from './IChannel';
import { ISlackUserWithIM } from './ISlackUserWithIM';

export interface ISlackUserChannel extends IChannel {
    type: typeof SLACK_USER_CHANNEL_TYPE;
    user: ISlackUserWithIM;
}
