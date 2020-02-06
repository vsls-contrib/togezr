import { initGit, startListenOnBranchChange } from './git';

export async function registerBranchBroadcastingExperiment() {
    initGit();
    await startListenOnBranchChange();
}
