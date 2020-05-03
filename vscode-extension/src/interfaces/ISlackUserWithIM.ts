import { WebAPICallResult } from '@slack/web-api';
import { ISlackIM } from './ISlackIM';
import { ISlackTeam } from './ISlackTeam';
import { ISlackUser } from './ISlackUser';

export interface ISlackUserWithIM extends ISlackUser {
    im: ISlackIM;
}

export interface ISlackUsersWebCallResult extends WebAPICallResult {
    members: ISlackUser[];
}

export interface ISlackImsWebCallResult extends WebAPICallResult {
    ims?: ISlackIM[];
}

export interface ISlackTeamInfoWebCallResult extends ISlackImsWebCallResult {
    team?: ISlackTeam;
}
