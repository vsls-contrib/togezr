import * as vscode from 'vscode';

export interface IBranchRegistrationOptions {
  branchName: string;
}

let memento: vscode.Memento | null = null;

export const initializeBranchRegistry = (context: vscode.ExtensionContext) => {
  memento = context.globalState;
};

const BRANCH_REGISTRY_PREFIX = 'tgzr.branch.registry.';

const getBranchRecordName = (branchName: string) => {
  return `${BRANCH_REGISTRY_PREFIX}${branchName}`;
};
export const registerBranch = async (options: IBranchRegistrationOptions) => {
  if (!memento) {
    throw new Error(
      'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
    );
  }
  const { branchName } = options;

  const registryData = memento.get(getBranchRecordName(branchName)) || {};

  if (registryData) {
    return;
  }

  memento.update(getBranchRecordName(branchName), {});
};

export const unregisterBranch = async (options: IBranchRegistrationOptions) => {
  if (!memento) {
    throw new Error(
      'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
    );
  }
  const { branchName } = options;

  memento.update(getBranchRecordName(branchName), null);
};

export const isBranchAlreadyRegistered = (branchName: string) => {
  if (!memento) {
    throw new Error(
      'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
    );
  }

  const registryData = memento.get(getBranchRecordName(branchName)) || {};

  return !!registryData;
};
