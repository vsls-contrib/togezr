import {
    TEAMS_CHANNEL_CHANNEL_TYPE,
    TEAMS_USER_CHANNEL_TYPE,
} from '../constants';
import { ITeamsChannelChannel } from './ITeamsChannelChannel';
import { ITeamsUserChannel } from './ITemsUserChannel';

export type TTeamsUserChannelType = typeof TEAMS_USER_CHANNEL_TYPE;
export type TTeamsChannelChannelType = typeof TEAMS_CHANNEL_CHANNEL_TYPE;

export type TTeamsChannelType =
    | TTeamsUserChannelType
    | TTeamsChannelChannelType;

export type TTeamsChannel = ITeamsUserChannel | ITeamsChannelChannel;
