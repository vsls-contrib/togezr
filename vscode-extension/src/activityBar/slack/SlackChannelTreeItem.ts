import { TreeItem } from 'vscode';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
export class SlackChannelTreeItem extends TreeItem {
    constructor(channel: ISlackChannel) {
        const { name, topic } = channel;
        super(`#${name}`);
        this.description = topic.value;
    }
}
