import { EventEmitter } from 'vscode';
import { getCurrentBranch, getCurrentRepo } from '.';
import { Commit } from '../../typings/git';

const POLL_INTERVAL = 3000;

const onCommitEmitter = new EventEmitter<[Commit, string]>();
export const onCommitPushToRemote = onCommitEmitter.event;

let prevState: boolean | undefined;
let prevOriginCommit: string | undefined;

let branchListenerInterval: any;
export const startListenToOriginPush = () => {
    branchListenerInterval = setInterval(async () => {
        const repo = getCurrentRepo();

        if (!repo) {
            return;
        }

        const currentBranch = getCurrentBranch();
        if (!currentBranch) {
            return;
        }

        const origin = await repo.getBranch(`origin/${currentBranch.name}`);

        if (!origin) {
            return;
        }

        const currentState = origin.commit === currentBranch.commit;
        if (
            prevState === false &&
            currentState === true &&
            currentBranch.commit! !== prevOriginCommit
        ) {
            const commit = await repo.getCommit(origin.commit!);

            onCommitEmitter.fire([
                commit,
                repo.state.remotes[0].pushUrl!.replace(/\/?\.git/gim, ''),
            ]);
        }

        prevState = currentState;
        prevOriginCommit = origin.commit;
    }, POLL_INTERVAL);
};

export const stopListenToBranchChanges = () => {
    clearInterval(branchListenerInterval);
};
