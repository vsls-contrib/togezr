import * as path from 'path';
import {
    Disposable,
    Event,
    EventEmitter,
    ProviderResult,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    window,
} from 'vscode';
// import { connectorRepository } from 'src/connectorRepository/connectorRepository';
import {
    getRegistryRecords,
    IRegistryData,
} from '../commands/registerBranch/branchRegistry';
import {
    connectorRepository,
    IGitHubConnector,
} from '../connectorRepository/connectorRepository';
import { EXTENSION_NAME_LOWERCASE } from '../constants';
import { IConnectorData } from '../interfaces/IConnectorData';
import { getIssueId } from '../sessionConnectors/getIssueId';
import { getIconPack } from '../utils/icons';

const BRANCH_CONNECTIONS_ITEM = new TreeItem(
    'Branch connections',
    TreeItemCollapsibleState.Expanded
);

const CONNECTORS_ITEM = new TreeItem(
    'Connectors',
    TreeItemCollapsibleState.Expanded
);

class BranchConnectionTreeItem extends TreeItem {
    constructor(
        label: string,
        collapsibleState: TreeItemCollapsibleState,
        public registryData: IRegistryData
    ) {
        super(label, collapsibleState);

        const iconNameSuffix = registryData.isReadOnly ? 'readonly-' : '';

        this.iconPath = getIconPack(`branch-inline-${iconNameSuffix}icon.svg`);

        const tooltipSuffix = registryData.isReadOnly ? '(read-only)' : '';

        this.tooltip = `${label} ${tooltipSuffix}`;
    }
}

class BranchConnectionConnectorTreeItem extends TreeItem {
    constructor(connectorData: IConnectorData) {
        const { githubIssue } = connectorData.data;

        const connector = connectorRepository.getConnector(connectorData.id);

        if (!connector) {
            throw new Error(
                `No connector found for "${connectorData.type}" / "${connectorData.id}"`
            );
        }

        const label = `${connector.name}`;
        super(label);

        this.description = `Issue#${getIssueId(githubIssue)}`;

        this.iconPath = getIconPack('github-connector-icon.svg');
    }
}

class GithubConnectorTreeItem extends TreeItem {
    constructor(connector: IGitHubConnector) {
        const label = `${connector.name}`;
        super(label);

        this.iconPath = getIconPack('github-connector-icon.svg');
    }
}

export class ActivityBar implements TreeDataProvider<TreeItem>, Disposable {
    private _disposables: Disposable[] = [];

    private _onDidChangeTreeData = new EventEmitter<TreeItem>();
    public readonly onDidChangeTreeData: Event<TreeItem> = this
        ._onDidChangeTreeData.event;

    constructor() {
        BRANCH_CONNECTIONS_ITEM.iconPath = getIconPack('branch-icon.svg');
        CONNECTORS_ITEM.iconPath = getIconPack('connector-icon.svg');
    }

    public getChildren(element?: TreeItem): ProviderResult<TreeItem[]> {
        if (!element) {
            return [BRANCH_CONNECTIONS_ITEM, CONNECTORS_ITEM];
        }

        if (element === BRANCH_CONNECTIONS_ITEM) {
            const branchConnections = getRegistryRecords();
            const items = Object.entries(branchConnections).map(
                ([name, registryData]) => {
                    const item = new BranchConnectionTreeItem(
                        `${registryData.branchName}`,
                        TreeItemCollapsibleState.Collapsed,
                        registryData
                    );
                    item.description = path.basename(registryData.repoId);

                    return item;
                }
            );

            return items;
        }

        if (element === CONNECTORS_ITEM) {
            const connectors = connectorRepository.getConnectors();

            const items = connectors.map((connector) => {
                const item = new GithubConnectorTreeItem(connector);

                return item;
            });

            return items;
        }

        if (element instanceof BranchConnectionTreeItem) {
            if (!element.registryData) {
                throw new Error(
                    'No registryData set on BranchConnectionTreeItem.'
                );
            }
            const items = element.registryData.connectorsData.map(
                (connector) => {
                    const item = new BranchConnectionConnectorTreeItem(
                        connector
                    );

                    return item;
                }
            );

            return items;
        }

        return [];
    }

    public getTreeItem(node: TreeItem): TreeItem {
        return node;
    }

    public dispose() {
        this._disposables.forEach((disposable) => disposable.dispose());
    }
}

export const registerActivityBar = () => {
    const treeDataProvider = new ActivityBar();

    window.createTreeView(`${EXTENSION_NAME_LOWERCASE}.activitybar`, {
        treeDataProvider,
    });
};
