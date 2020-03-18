import { IAccountRecord } from './IAccountRecord';
import { TSlackChannelType } from './TSlackChannelType';

export interface IChannel {
    type: TSlackChannelType;
    account: IAccountRecord;
}
