import { BranchConnectionTreeItem } from '../../activityBar/activityBar';
import { startLiveShareSession } from '../../branchBroadcast/liveshare';

export const startBranchConnectionSessionCommand = async (
    item?: BranchConnectionTreeItem
) => {
    if (!item) {
        return;
    }

    await startLiveShareSession(item.registryData.id);
};
