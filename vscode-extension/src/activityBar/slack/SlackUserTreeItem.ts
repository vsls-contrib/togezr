import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { ISlackUserWithIM } from '../../interfaces/ISlackUserWithIM';
import { SLACK_EMOJI_MAP } from '../../slack/constants';
import { ShareIntoTreeItem } from '../ShareIntoTreeItem';

export class SlackUserTreeItem extends ShareIntoTreeItem {
    constructor(public user: ISlackUserWithIM, public account: IAccountRecord) {
        super(user.real_name || user.name);

        const { profile } = user;

        this.description = `${SLACK_EMOJI_MAP[profile.status_emoji]} ${
            profile.status_text
        }`;
    }
}
