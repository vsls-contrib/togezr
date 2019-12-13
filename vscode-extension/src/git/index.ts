import * as vscode from 'vscode';
import { API, GitExtension } from '../typings/git';

export const getUserName = require('git-user-name') as () => string | undefined;

let gitAPI: API | null = null;

// const isDesendant = (child: string, parent: string) => {
//   if (child === parent) {
//     return true;
//   }

//   const parentTokens = parent.split("/").filter(i => i.length);
//   return parentTokens.every((t, i) => {
//     return child.split("/")[i] === t;
//   });
// };

export const isBranchExist = async (branchName: string) => {
  if (!gitAPI) {
    throw new Error('Initialize Git API first.');
  }

  try {
    const repo = gitAPI.repositories[0];

    const branch = await repo.getBranch(branchName);

    return !!branch;
  } catch {
    return false;
  }
};

export const initGit = () => {
  let gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');

  if (!gitExtension) {
    throw Error('No Git extension found.');
  }

  gitAPI = gitExtension.exports.getAPI(1) as API;
};

export const getRepos = () => {
  if (!gitAPI) {
    throw new Error('Initialize Git API first.');
  }

  return gitAPI.repositories;
};

export const getCurrentBranch = () => {
  if (!gitAPI) {
    throw new Error('Initialize Git API first.');
  }

  const repo = gitAPI.repositories[0];

  return repo.state.HEAD;
};

export const createBranch = async (
  branchName: string,
  isSwitch: boolean,
  currentBranch: string,
  fromBranch: string
) => {
  if (!gitAPI) {
    throw new Error('Initialize Git API first.');
  }

  const repo = gitAPI.repositories[0];

  if (isSwitch) {
    await repo.checkout(fromBranch);
  }

  await repo.createBranch(branchName, false);

  // got back to the original branch
  await repo.checkout(currentBranch);
};

export const switchToTheBranch = async (branchName: string) => {
  if (!gitAPI) {
    throw new Error('Initialize Git API first.');
  }

  const repo = gitAPI.repositories[0];
  await repo.checkout(branchName);
};
