import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { ISlackUserWithIM } from '../../interfaces/ISlackUserWithIM';
import { renderSlackStatus } from '../../utils/renderSlackStatus';
import { ShareIntoTreeItem } from '../ShareIntoTreeItem';

export class SlackUserTreeItem extends ShareIntoTreeItem {
    constructor(public user: ISlackUserWithIM, public account: IAccountRecord) {
        super(user.real_name || user.name);

        const { profile } = user;
        const { status_emoji, status_text } = profile;

        this.description = renderSlackStatus(status_emoji, status_text);
    }
}
