import {
    SLACK_CHANNEL_CHANNEL_TYPE,
    SLACK_USER_CHANNEL_TYPE,
} from '../constants';
import { ISlackChannelChannel } from './ISlackChannelChannel';
import { ISlackUserChannel } from './ISlackUserChannel';

export type TSlackUserChannelType = typeof SLACK_USER_CHANNEL_TYPE;
export type TSlackChannelChannelType = typeof SLACK_CHANNEL_CHANNEL_TYPE;

export type TSlackChannelType =
    | TSlackUserChannelType
    | TSlackChannelChannelType;

export type TSlackChannel = ISlackUserChannel | ISlackChannelChannel;
