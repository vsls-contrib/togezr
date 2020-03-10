import { TreeItem } from 'vscode';
import { ISlackUser } from '../../interfaces/ISlackUser';
import { SLACK_EMOJI_MAP } from '../../slack/constants';
export class SlackUserTreeItem extends TreeItem {
    constructor(user: ISlackUser) {
        super(user.real_name || user.name);
        const { profile } = user;
        this.description = `${SLACK_EMOJI_MAP[profile.status_emoji]} ${
            profile.status_text
        }`;
    }
}
