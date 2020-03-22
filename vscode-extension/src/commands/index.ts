import { addAccountCommand } from './addAccountCommand';
import { addConnectorCommand } from './addConnectorCommand';
import { addGitHubAccountRepoCommand } from './addGitHubAccountRepoCommand';
import { disconnectBranchCommand } from './disconnectBranch';
import { openAccountInBrowserCommand } from './openAccountInBrowserCommand';
import {
    openConnectorInBrowserCommand,
    openInBrowserCommand,
} from './openInBrowserCommand';
import { registerBranchCommand } from './registerBranch';
import { registerCommand } from './registerCommand';
import { removeAccountCommand } from './removeAccountCommand';
import { removeConnectorCommand } from './removeConnector';
import { removeGitHubAccountRepoCommand } from './removeGitHubAccountRepoCommand';
import { shareIntoAccountCommand } from './shareIntoAccountCommand/shareIntoAccountCommand';
import { shareIntoCommand } from './shareIntoCommand';
import { startBranchConnectionSessionCommand } from './startBranchConnectionSessionCommand';
import { stopRunningSessionCommand } from './stopRunningSessionCommand';

export const registerCommands = () => {
    registerCommand('togezr.connectBranch', registerBranchCommand);
    registerCommand('togezr.disconnectBranch', disconnectBranchCommand);
    registerCommand('togezr.addConnector', addConnectorCommand);
    registerCommand('togezr.removeConnector', removeConnectorCommand);
    registerCommand('togezr.shareInto', shareIntoCommand);
    registerCommand('togezr.shareIntoAccount', shareIntoAccountCommand);
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

    registerCommand('togezr.addAccount', addAccountCommand);
    registerCommand('togezr.removeAccount', removeAccountCommand);
    registerCommand('togezr.openAccountInBrowser', openAccountInBrowserCommand);
    registerCommand('togezr.addGitHubAccountRepo', addGitHubAccountRepoCommand);
    registerCommand(
        'togezr.removeGitHubAccountRepo',
        removeGitHubAccountRepoCommand
    );
};
