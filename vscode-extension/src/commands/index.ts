import { registerBranchCommand } from './registerBranch';
import { registerCommand } from './registerCommand';

export const registerCommands = () => {
  registerCommand('tgzr.registerFeatureBranch', registerBranchCommand);
};
