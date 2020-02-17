import * as vscode from 'vscode';
import {
    ConnectorTreeItem,
    refreshActivityBar,
} from '../../activityBar/activityBar';
import { connectorRepository } from '../../connectorRepository/connectorRepository';

export const removeConnectorCommand = async (item?: ConnectorTreeItem) => {
    if (item) {
        connectorRepository.removeConnector(item.id);
        refreshActivityBar();
        return;
    }

    const connectors = connectorRepository.getConnectors();
    if (!connectors) {
        vscode.window.showInformationMessage('No connectors found.');

        return;
    }

    const options = connectors.map((connector) => {
        return {
            label: connector.name,
            description: connector.type,
            connector,
        };
    });

    const answer = await vscode.window.showQuickPick(options, {
        ignoreFocusOut: true,
        placeHolder: 'Select a connector to remove',
    });

    if (!answer) {
        return;
    }

    connectorRepository.removeConnector(answer.connector.id);
    refreshActivityBar();
};
