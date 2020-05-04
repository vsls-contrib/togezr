import { ITeamsTeam } from '../teams/teamsTeamsRepository';
import { IChannel } from './IChannel';
import { ITeamsChannel } from './ITeamsChannel';
import { TTeamsChannelChannelType } from './TTeamsChannel';

export interface ITeamsChannelChannel extends IChannel {
    type: TTeamsChannelChannelType;
    channel: ITeamsChannel;
    team: ITeamsTeam;
}
