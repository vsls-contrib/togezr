import { getApi as getVslsApi, LiveShare } from 'vsls';
import {
  isBranchExplicitellyStopped,
  resetBranchExplicitelyStopped,
  setBranchExplicitelyStopped,
} from '../commands/registerBranch/branchRegistry';
import { getCurrentBranch } from '../git';

let lsAPI: LiveShare | null = null;

export const initLiveShare = async () => {
  const maybeAPI = await getVslsApi();
  if (!maybeAPI) {
    throw new Error('No Live Share extension found.');
  }

  lsAPI = maybeAPI;

  lsAPI.onDidChangeSession((e) => {
    if (e.session.id) {
      const currentBranch = getCurrentBranch();

      if (!currentBranch) {
        return;
      }

      if (isBranchExplicitellyStopped(currentBranch.name!)) {
        resetBranchExplicitelyStopped(currentBranch.name!);
      }
    }
  });
};

let isBranchRunning = false;
export const startLiveShareSession = async () => {
  if (!lsAPI) {
    throw new Error('No Live Share API found. Call `initLiveShare` first.');
  }

  if (lsAPI.session.id) {
    isBranchRunning = true;
    return;
  }

  if (isBranchRunning) {
    return;
  }

  isBranchRunning = true;
  const uri = await lsAPI.share();

  lsAPI.onDidChangeSession((e) => {
    if (!e.session.id) {
      if (isBranchRunning) {
        const currentBranch = getCurrentBranch();
        if (!currentBranch) {
          throw new Error('Branch is running but no current branch found.');
        }
        setBranchExplicitelyStopped(currentBranch.name!);
      }
      isBranchRunning = false;
    }
  });

  console.log(uri);
};

export const stopLiveShareSession = async () => {
  if (!lsAPI) {
    throw new Error('No Live Share API found. Call `initLiveShare` first.');
  }

  if (!lsAPI.session.id) {
    isBranchRunning = false;
    return;
  }

  if (!isBranchRunning) {
    return;
  }

  isBranchRunning = false;
  const result = await lsAPI.end();

  console.log(result);
};
