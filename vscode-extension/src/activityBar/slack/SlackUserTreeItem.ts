import { IAccountRecord } from '../../interfaces/IAccountRecord';
import { ISlackUserWithIM } from '../../interfaces/ISlackUserWithIM';
import { getIconPack } from '../../utils/icons';
import { renderSlackStatus } from '../../utils/renderSlackStatus';
import { ShareIntoTreeItem } from '../ShareIntoTreeItem';
import {
    slackUserStatusRepository,
    TUserPresenceStatus,
} from './slackUserStatusRepository';

export class SlackUserTreeItem extends ShareIntoTreeItem {
    constructor(public user: ISlackUserWithIM, public account: IAccountRecord) {
        super(user.real_name || user.name);

        const { profile } = user;
        const { status_emoji, status_text } = profile;

        this.description = renderSlackStatus(status_emoji, status_text);

        if (user.is_bot || user.profile.always_active) {
            this.iconPath = getIconPack('presence-status-active-icon.svg');
            return;
        }

        const cachedStatus = slackUserStatusRepository.getCachedStatus(user.id);
        this.getUserPresenceIcon(cachedStatus.status);
    }

    private getUserPresenceIcon = (status: TUserPresenceStatus) => {
        switch (status) {
            case 'unknown': {
                this.iconPath = getIconPack('presence-status-unknown-icon.svg');
                break;
            }

            case 'active': {
                this.iconPath = getIconPack('presence-status-active-icon.svg');
                break;
            }

            case 'away': {
                this.iconPath = getIconPack('presence-status-away-icon.svg');
                break;
            }
        }
    };
}
