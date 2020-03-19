import * as vscode from 'vscode';
import { CancellationError } from '../../errors/CancellationError';
import { ISlackIM } from '../../interfaces/ISlackIm';
import { ISlackUser } from '../../interfaces/ISlackUser';
import { ISlackUserWithIM } from '../../interfaces/ISlackUserWithIM';
import { renderSlackStatus } from '../../utils/renderSlackStatus';
import { getUsersWithIms } from './getUsersWithIms';

export const getSlackUserChannel = async (
    allUsers: ISlackUser[],
    ims: ISlackIM[]
): Promise<ISlackUserWithIM> => {
    const users = getUsersWithIms(allUsers, ims);
    if (!users.length) {
        throw new Error('No users with IMs found.');
    }
    const options = users
        .map((user) => {
            const { profile } = user;
            const { status_emoji, status_text } = profile;

            const description = renderSlackStatus(status_emoji, status_text);

            return {
                label: user.real_name,
                description,
                user,
            };
        })
        .filter((user) => {
            // && !user.user.is_bot
            return !!user.label;
        });
    const selectedUser = await vscode.window.showQuickPick(options, {
        // canPickMany: true,
        ignoreFocusOut: true,
        placeHolder: 'Select users to share with',
    });
    if (!selectedUser) {
        throw new CancellationError();
    }
    return selectedUser.user;
};
