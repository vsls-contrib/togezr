import { WebAPICallResult } from '@slack/web-api';
import { ISlackUser } from '../../../interfaces/ISlackUser';

export interface ISlackUsersWebCallResult extends WebAPICallResult {
    members?: ISlackUser[];
}
