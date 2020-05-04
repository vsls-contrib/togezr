import { ISlackChannel } from '../../../interfaces/ISlackChannel';
import { ISlackUserWithIM } from '../../../interfaces/ISlackUserWithIM';

export interface ISlackAccountCacheRecord {
    users: ISlackUserWithIM[];
    channels: ISlackChannel[];
}
