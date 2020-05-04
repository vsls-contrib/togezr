import { stopLiveShareSession } from '../branchBroadcast/liveshare';
import {
    branchAutoShareRegistry,
    IBranchChannelsRecord,
} from '../channels/BranchAutoShareRegistry';
import { branchAutoShareRunner } from '../channels/BranchAutoShareRunner';
import { shareIntoChannels } from '../channels/shareIntoChannels';
import { IApiV1 } from '../interfaces/IApiV1';
import { TChannel } from '../interfaces/TChannel';
import { IRepoInfo } from '../renderers/slack/renderGithubIssueDetails';

export class ApiV1 implements IApiV1 {
    public shareIntoChannels = async (
        channels: TChannel[],
        isReadOnly: boolean
    ) => {
        return await shareIntoChannels(channels, isReadOnly);
    };

    public stopSharingIntoChannels = async (): Promise<IApiV1> => {
        await stopLiveShareSession();

        return this as IApiV1;
    };

    public registerBranchForAutoShare = async (
        branchRecord: IBranchChannelsRecord
    ): Promise<IApiV1> => {
        branchAutoShareRegistry.add(branchRecord);

        return this;
    };

    public unregisterBranchForAutoShare = async (
        branchInfo: IRepoInfo
    ): Promise<IApiV1> => {
        branchAutoShareRegistry.remove(branchInfo);
        await branchAutoShareRunner.stopBranchIfRunning(branchInfo);

        return this;
    };
}
