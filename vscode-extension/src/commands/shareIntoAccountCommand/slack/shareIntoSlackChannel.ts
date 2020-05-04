import { lsApi, startLSSession } from '../../../branchBroadcast/liveshare';
import { SlackChannelSession } from '../../../channels/SlackChannelSession';
import { CancellationError } from '../../../errors/CancellationError';
import { TSlackTreeItems } from '../../../interfaces/TTreeItems';
import { askUserForSlackChannel } from './askUserForSlackChannel';
import { getSlackChannelFromTreeItem } from './getSlackChannelFromTreeItem';

export const shareIntoSlackChannel = async (
    item: TSlackTreeItems,
    isReadOnlySession: boolean
) => {
    const slackChannel = item
        ? getSlackChannelFromTreeItem(item)
        : await askUserForSlackChannel();
    if (!slackChannel) {
        throw new CancellationError('No slack channel found.');
    }

    const lsAPI = lsApi();
    const session = new SlackChannelSession(slackChannel, [], lsAPI);
    await startLSSession(isReadOnlySession, session.sessionId);

    await session.init();
};
