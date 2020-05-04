import * as vscode from 'vscode';
import { CancellationError } from '../../../errors/CancellationError';
import { ISlackChannel } from '../../../interfaces/ISlackChannel';

export const getSlackChannelChannel = async (
    channels: ISlackChannel[]
): Promise<ISlackChannel> => {
    const options = channels
        .map((channel) => {
            return {
                label: `#${channel.name}`,
                description: channel.purpose.value,
                channel,
            };
        })
        .filter((channel) => {
            return !channel.channel.unlinked && !channel.channel.is_archived;
        });
    const selectedChannel = await vscode.window.showQuickPick(options, {
        // canPickMany: true,
        ignoreFocusOut: true,
        placeHolder: 'Select channels to share into',
    });
    if (!selectedChannel) {
        throw new CancellationError('No channel selected.');
    }
    return selectedChannel.channel;
};
