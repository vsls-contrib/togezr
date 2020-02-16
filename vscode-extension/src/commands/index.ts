import { addConnectorCommand } from './addConnectorCommand';
import { disconnectBranchCommand } from './disconnectBranch';
import { registerBranchCommand } from './registerBranch';
import { registerCommand } from './registerCommand';
import { removeConnectorCommand } from './removeConnector';

export const registerCommands = () => {
    registerCommand('togezr.connectBranch', registerBranchCommand);
    registerCommand('togezr.disconnectBranch', disconnectBranchCommand);
    registerCommand('togezr.addConnector', addConnectorCommand);
    registerCommand('togezr.removeConnector', removeConnectorCommand);
};
