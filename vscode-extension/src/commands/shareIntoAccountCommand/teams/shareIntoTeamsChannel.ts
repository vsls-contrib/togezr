import { lsApi, startLSSession } from '../../../branchBroadcast/liveshare';
import { TeamsChannelSession } from '../../../channels/TeamsChannelSession';
import { CancellationError } from '../../../errors/CancellationError';
import { TTeamsTreeItems } from '../../../interfaces/TTreeItems';
import { getTeamsChannelFromTreeItem } from './getTeamsChannelFromTreeItem';

export const shareIntoTeamsChannel = async (
    item: TTeamsTreeItems,
    isReadOnlySession: boolean
) => {
    if (!item) {
        throw new Error('No teams channel set.');
    }

    const teamsChannel = getTeamsChannelFromTreeItem(item);
    if (!teamsChannel) {
        throw new CancellationError('No slack channel found.');
    }

    const lsAPI = lsApi();
    const session = new TeamsChannelSession(teamsChannel, [], lsAPI);
    await startLSSession(isReadOnlySession, session.sessionId);
    await session.init();
};
