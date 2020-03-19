import { WebAPICallResult } from '@slack/web-api';
import { ISlackChannel } from '../../../interfaces/ISlackChannel';

export interface ISlackChannelsWebCallResult extends WebAPICallResult {
    channels?: ISlackChannel[];
}
