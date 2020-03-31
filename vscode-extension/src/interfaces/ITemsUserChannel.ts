import { IChannel } from './IChannel';
import { ITeamsUser } from './ITeamsUser';
import { TTeamsUserChannelType } from './TTeamsChannel';

export interface ITeamsUserChannel extends IChannel {
    type: TTeamsUserChannelType;
    user: ITeamsUser;
}
