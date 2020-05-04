import { IAccountRecord } from './IAccountRecord';
import { TChannelType } from './TChannel';

export interface IChannel {
    type: TChannelType;
    account: IAccountRecord;
    id: string;
}
