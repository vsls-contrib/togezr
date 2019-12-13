import * as vscode from 'vscode';
import { createCommand } from './createCommand';
import { IRegisterBranchOptions } from './registerBranch';

export async function registerCommand(
  name: 'tgzr.registerFeatureBranch',
  command: (options?: IRegisterBranchOptions) => void
): Promise<void>;
export async function registerCommand(name: any, command: any) {
  const wrappedCommand = createCommand(command);

  // push to context
  vscode.commands.registerCommand(name, wrappedCommand);
}
