import { getCurrentBranch, getCurrentRepo } from '../branchBroadcast/git';
import {
    getBranchRegistryRecordByRepoAndBranch,
    IRegistryData,
} from '../commands/registerBranch/branchRegistry';

export const getCurrentBranchRegistryData = (): IRegistryData | undefined => {
    const repo = getCurrentRepo();
    if (!repo) {
        return undefined;
    }
    const branch = getCurrentBranch();
    if (!branch) {
        return undefined;
    }

    const registryData = getBranchRegistryRecordByRepoAndBranch(
        repo.rootUri.toString(),
        branch.name!
    );

    return registryData;
};
