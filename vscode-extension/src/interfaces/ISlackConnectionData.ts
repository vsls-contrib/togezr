import { ISlackChannel } from './ISlackChannel';

export interface ISlackConnectionData {
    channel: ISlackChannel;
    channelConnectionName: string;
}
