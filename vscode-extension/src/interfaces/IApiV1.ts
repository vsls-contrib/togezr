import { IBranchChannelsRecord } from '../channels/BranchAutoShareRegistry';
import { IRepoInfo } from '../renderers/slack/renderGithubIssueDetails';
import { IGitHubRepoIssueChannel } from './IGitHubRepoIssueChannel';

export interface IApiV1 {
    shareIntoChannels(
        channels: IGitHubRepoIssueChannel[],
        isReadOnly: boolean
    ): Promise<string>;
    stopSharingIntoChannels(): Promise<IApiV1>;
    registerBranchForAutoShare(
        branchRecord: IBranchChannelsRecord
    ): Promise<IApiV1>;
    unregisterBranchForAutoShare(branchInfo: IRepoInfo): Promise<IApiV1>;
}
