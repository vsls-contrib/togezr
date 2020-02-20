import { addConnectorCommand } from './addConnectorCommand';
import { disconnectBranchCommand } from './disconnectBranch';
import {
    openConnectorInBrowserCommand,
    openInBrowserCommand,
} from './openInBrowserCommand';
import { registerBranchCommand } from './registerBranch';
import { registerCommand } from './registerCommand';
import { removeConnectorCommand } from './removeConnector';
import { shareIntoCommand } from './shareIntoCommand';
import { startBranchConnectionSessionCommand } from './startBranchConnectionSessionCommand';
import { stopRunningSessionCommand } from './stopRunningSessionCommand';

export const registerCommands = () => {
    registerCommand('togezr.connectBranch', registerBranchCommand);
    registerCommand('togezr.disconnectBranch', disconnectBranchCommand);
    registerCommand('togezr.addConnector', addConnectorCommand);
    registerCommand('togezr.removeConnector', removeConnectorCommand);
    registerCommand('togezr.shareInto', shareIntoCommand);
    registerCommand('togezr.stopRunningSession', stopRunningSessionCommand);
    registerCommand(
        'togezr.startBranchConnectionSession',
        startBranchConnectionSessionCommand
    );
    registerCommand('togezr.openInBrowser', openInBrowserCommand);
    registerCommand(
        'togezr.openConnectorInBrowser',
        openConnectorInBrowserCommand
    );
};
