import { EventEmitter } from 'vscode';
import { getCurrentBranch } from '.';
import {
    TBranchChangeArguments,
    TBranchNameType,
} from '../../interfaces/TBranchNameType';

const POLL_INTERVAL = 3000;

let prevBranchName: TBranchNameType;
let currentBranchName: TBranchNameType;

const onBranchChangeEmitter = new EventEmitter<TBranchChangeArguments>();
export const onBranchChange = onBranchChangeEmitter.event;

const branchListenerInterval = setInterval(async () => {
    const currentBranch = getCurrentBranch();

    if (!currentBranch) {
        currentBranchName = undefined;
    } else {
        currentBranchName = currentBranch.name!;
    }

    if (currentBranchName !== prevBranchName) {
        onBranchChangeEmitter.fire([prevBranchName, currentBranchName]);
        prevBranchName = currentBranchName;
    }
}, POLL_INTERVAL);

export const stopListenToBranchChanges = () => {
    clearInterval(branchListenerInterval);
};
