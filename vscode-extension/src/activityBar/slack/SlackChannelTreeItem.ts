import {
    ISlackAccountRecord,
    TAccountRecord,
} from '../../interfaces/IAccountRecord';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import { ShareIntoTreeItem } from '../ShareIntoTreeItem';

export class SlackChannelTreeItem extends ShareIntoTreeItem {
    public channel: ISlackChannel;
    public account: TAccountRecord;

    constructor(channel: ISlackChannel, account: ISlackAccountRecord) {
        const { name, topic } = channel;
        super(`#${name}`);

        this.description = topic.value;

        this.channel = channel;
        this.account = account;
    }
}
