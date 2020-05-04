import * as path from 'path';
import { getCurrentBranch, getCurrentRepo } from '../../branchBroadcast/git';
import { IRepoInfo } from './renderGithubIssueDetails';

export const getLocalRepoInfo = (): IRepoInfo | undefined => {
    const repo = getCurrentRepo();
    if (!repo) {
        return;
    }
    const branch = getCurrentBranch();
    return {
        repoName: path.basename(repo.rootUri.fsPath),
        branchName: branch ? branch.name : void 0,
    };
};
