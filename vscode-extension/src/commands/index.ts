import { addReporterCommand } from './addReporterCommand';
import { registerBranchCommand } from './registerBranch';
import { registerCommand } from './registerCommand';
import { setGithubTokenCommand } from './setGithubTokenCOmmand';

export const registerCommands = () => {
    registerCommand(
        'togezr.registerFeatureBranchForBroadcast',
        registerBranchCommand
    );

    registerCommand('togezr.setGitHubToken', setGithubTokenCommand);

    registerCommand('togezr.addReporter', addReporterCommand);
};
