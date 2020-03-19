import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import { ShareIntoTreeItem } from '../ShareIntoTreeItem';

export class SlackChannelTreeItem extends ShareIntoTreeItem {
    public channel: ISlackChannel;
    public account: IAccountRecord;

    constructor(channel: ISlackChannel, account: IAccountRecord) {
        const { name, topic } = channel;
        super(`#${name}`);

        this.description = topic.value;

        this.channel = channel;
        this.account = account;
    }
}
