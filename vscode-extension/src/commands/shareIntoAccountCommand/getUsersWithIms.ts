import { ISlackIM } from '../../interfaces/ISlackIm';
import { ISlackUser } from '../../interfaces/ISlackUser';
import { ISlackUserWithIM } from '../../interfaces/ISlackUserWithIM';

export const getUsersWithIms = (
    users: ISlackUser[],
    ims: ISlackIM[]
): ISlackUserWithIM[] => {
    const result: ISlackUserWithIM[] = [];
    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];
        const hasIm = ims.find((im) => {
            return (
                im.user === currentUser.id &&
                !im.is_user_deleted &&
                !im.is_archived
            );
        });
        if (hasIm) {
            result.push({
                ...currentUser,
                im: hasIm,
            });
        }
    }
    return result;
};
