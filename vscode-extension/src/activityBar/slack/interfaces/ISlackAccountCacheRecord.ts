import { ISlackChannel } from '../../../interfaces/ISlackChannel';
import { ISlackUser } from '../../../interfaces/ISlackUser';
export interface ISlackAccountCacheRecord {
    users: ISlackUser[];
    channels: ISlackChannel[];
}
