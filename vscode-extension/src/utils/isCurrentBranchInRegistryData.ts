import { getCurrentBranch, getCurrentRepo } from '../branchBroadcast/git';
import { IRegistryData } from '../commands/registerBranch/branchRegistry';

export const isCurrentBranchInRegistryData = (registryData: IRegistryData) => {
    const repo = getCurrentRepo();
    if (!repo) {
        return false;
    }
    const branch = getCurrentBranch();
    if (!branch) {
        return false;
    }
    return !!(
        repo.rootUri.toString() === registryData.repoId &&
        branch.name &&
        branch.name === registryData.branchName
    );
};
