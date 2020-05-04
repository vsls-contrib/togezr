import { ISessionUserJoinEvent } from '../../sessionConnectors/renderer/events';
import { User } from '../../user';

export const renderGuestJoinEventReply = async (
    event: ISessionUserJoinEvent
) => {
    const user = new User(event.user);
    return {
        text: `${user.displayName} joined the session.`,
        blocks: [
            {
                type: 'context',
                elements: [
                    {
                        type: 'image',
                        image_url: await user.getUserAvatarLink(),
                        alt_text: user.displayName,
                    },
                    {
                        type: 'mrkdwn',
                        text: `${user.getSlackUserLink()} joined the session.`,
                    },
                ],
            },
        ],
    };
};
