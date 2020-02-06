import * as vscode from 'vscode';
import { registerBranchBroadcastingExperiment } from './branchBroadcast';
import { initializeLiveShare } from './branchBroadcast/liveshare';
import { registerCommands } from './commands';
import { EXTENSION_NAME } from './constants';
import { log } from './logger';
import { initializeMemento } from './memento';

export const activate = async (context: vscode.ExtensionContext) => {
    try {
        log.setLoggingChannel(
            vscode.window.createOutputChannel(EXTENSION_NAME)
        );

        initializeMemento(context);
        await initializeLiveShare();
        registerCommands();
        await registerBranchBroadcastingExperiment();
    } catch (e) {
        log.error(e);
        vscode.window.showErrorMessage(e.message);
    }
};

export const deactivate = async () => {};

// setTimeout(async () => {
//     await registerBranchBroadcastingExperiment(context);
//     const api = await result.getApiAsync('0.3.0');

//     api.onDidChangePeers((e) => {
//         const currentSession = getCurrentSession();
//         if (!currentSession) {
//             return;
//         }

//         const userAdded = e.added[0];

//         if (!userAdded) {
//             return;
//         }

//         currentSession.addGuest({
//             name: userAdded.user.userName,
//             id: userAdded.user.id,
//             email: userAdded.user.emailAddress,
//         });

//         // access:3
//         // peerNumber:5
//         // role:2
//         // user:
//         //     displayName:"Oleg Solomka"
//         //     emailAddress:"olsolomk@microsoft.com"
//         //     id:"8b902dce-19f3-4c1b-ae65-64b280df47ed"
//         //     userName:"olsolomk@microsoft.com"

//         console.log(e);
//     });
// }, 200);
