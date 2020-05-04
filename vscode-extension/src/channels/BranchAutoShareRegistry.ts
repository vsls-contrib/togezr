import { TChannel } from '../interfaces/TChannel';
import * as memento from '../memento';
import { IRepoInfo } from '../renderers/slack/renderGithubIssueDetails';

const BRANCHES_KEY = 'BRANCHES_AUTO_SHARE_REGISTRY';

export interface IBranchChannelsRecord extends IRepoInfo {
    channels: TChannel[];
}

class BranchAutoShareRegistry {
    private getBranchId = (branchRecord: IRepoInfo) => {
        return `${branchRecord.branchName}_${branchRecord.repoName}`;
    };

    public add = (branchRecord: IBranchChannelsRecord) => {
        const branches = this.getBranchRecords();

        const newBranches = branches.filter((br) => {
            return this.getBranchId(branchRecord) !== this.getBranchId(br);
        });

        newBranches.push(branchRecord);

        memento.set(BRANCHES_KEY, branchRecord);
    };

    public get = (branchRecord: IRepoInfo) => {
        const branches = this.getBranchRecords();

        const branch = branches.find((br) => {
            return this.getBranchId(branchRecord) === this.getBranchId(br);
        });

        return branch || null;
    };

    public getBranchRecords = (): IBranchChannelsRecord[] => {
        return memento.get(BRANCHES_KEY) || [];
    };

    public remove = (branch: IRepoInfo) => {
        const branches = this.getBranchRecords();

        const newBranches = branches.filter((br) => {
            return this.getBranchId(branch) !== this.getBranchId(br);
        });

        return memento.set(BRANCHES_KEY, newBranches);
    };
}

export const branchAutoShareRegistry = new BranchAutoShareRegistry();
