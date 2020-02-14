import { addConnectorCommand } from './addConnectorCommand';
import { registerBranchCommand } from './registerBranch';
import { registerCommand } from './registerCommand';

export const registerCommands = () => {
    registerCommand('togezr.connectBranch', registerBranchCommand);
    registerCommand('togezr.addConnector', addConnectorCommand);
};
