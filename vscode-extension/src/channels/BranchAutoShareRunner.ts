import { initGit } from '../branchBroadcast/git';
import { onBranchChange } from '../branchBroadcast/git/onBranchChange';
import { lsApi, stopLiveShareSession } from '../branchBroadcast/liveshare';
import {
    TBranchChangeArguments,
    TBranchNameType,
} from '../interfaces/TBranchNameType';
import { log } from '../logger';
import { getLocalRepoInfo } from '../renderers/slack/getLocalRepoInfo';
import { IRepoInfo } from '../renderers/slack/renderGithubIssueDetails';
import {
    branchAutoShareRegistry,
    IBranchChannelsRecord,
} from './BranchAutoShareRegistry';
import { shareIntoChannels } from './shareIntoChannels';

class BranchAutoShareRunner {
    public init = async () => {
        initGit();
        onBranchChange(this.onBranchChange);
    };

    private onBranchChange = async ([
        prevBranch,
        currentBranch,
    ]: TBranchChangeArguments) => {
        const lsAPI = await lsApi();

        /**
         * If branch was switched with an LS session running,
         * make sure we close the session if the previous branch
         * was registered for auto share.
         */
        if (lsAPI.session.id) {
            await this.handleLiveShareSessionDuringBranchChange(prevBranch);
        }

        // if no current branch, nothing to do here
        if (!currentBranch) {
            return;
        }

        /**
         * if there is a current branch, run LS session if
         * the branch is registered for auto share
         */
        await this.checkTheBranchForAutoShare(currentBranch);
    };

    private handleLiveShareSessionDuringBranchChange = async (
        prevBranch: TBranchNameType
    ) => {
        /**
         * if LS session is running, and switched to the new branch,
         * but no previous branch was registered.
         */
        if (!prevBranch) {
            return;
        }

        const repoInfo = getLocalRepoInfo();
        if (!repoInfo) {
            log.warning(
                'Switched to the new branch, but no repo info found [previous branch].'
            );
            return;
        }

        await this.stopBranchIfRunning({
            ...repoInfo,
            branchName: prevBranch,
        });
    };

    private checkTheBranchForAutoShare = async (currentBranch: string) => {
        const repoInfo = getLocalRepoInfo();

        if (!repoInfo) {
            log.warning(
                'Switched to the new branch, but no repo info found [current branch].'
            );
            return;
        }

        const registerdBranch = branchAutoShareRegistry.get({
            ...repoInfo,
            branchName: currentBranch,
        });

        // the current branch is not registered for auto share
        if (!registerdBranch) {
            return;
        }

        // *we have a match!*
        // share into all channels
        await this.autoShareBranch(registerdBranch);
    };

    private autoShareBranch = async (
        registerdBranch: IBranchChannelsRecord
    ) => {
        const { channels } = registerdBranch;

        await shareIntoChannels(channels);
    };

    public stopBranchIfRunning = async (repoInfo: IRepoInfo) => {
        // the previous branch was not registered for auto share
        const registerdBranch = branchAutoShareRegistry.get(repoInfo);

        if (!registerdBranch) {
            return;
        }

        // the branch *nost likely* was shared with auto share feature, stop sharing
        await stopLiveShareSession();
    };
}

export const branchAutoShareRunner = new BranchAutoShareRunner();
