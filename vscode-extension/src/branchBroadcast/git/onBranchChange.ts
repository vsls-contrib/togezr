import { EventEmitter } from 'vscode';
import { getCurrentBranch } from '.';

const POLL_INTERVAL = 1000;

type branchNameType = string | undefined;

let prevBranchName: branchNameType;
let currentBranchName: branchNameType;

const onBranchChangeEmitter = new EventEmitter<
  [branchNameType, branchNameType]
>();
export const onBranchChange = onBranchChangeEmitter.event;

const branchListenerInterval = setInterval(async () => {
  const currentBranch = getCurrentBranch();

  if (!currentBranch) {
    currentBranchName = undefined;
  } else {
    currentBranchName = currentBranch.name!;
  }

  if (currentBranchName !== prevBranchName) {
    prevBranchName = currentBranchName;
    onBranchChangeEmitter.fire([prevBranchName, currentBranchName]);
  }
}, POLL_INTERVAL);

export const stopListenToBranchChanges = () => {
  clearInterval(branchListenerInterval);
};