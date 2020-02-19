import {
    BranchConnectionTreeItem,
    refreshActivityBar,
} from '../../activityBar/activityBar';
import { stopLiveShareSession } from '../../branchBroadcast/liveshare';
import { setRegistryRecordRunning } from '../registerBranch/branchRegistry';

export const stopRunningSessionCommand = async (
    item?: BranchConnectionTreeItem
) => {
    if (!item) {
        throw new Error('No branch connection item was passed.');
    }

    setRegistryRecordRunning(item.registryData.id, false);
    refreshActivityBar();
    await stopLiveShareSession();
};
