import * as uuid from 'uuid/v4';
import { IGithubRepo } from '../interfaces/IGitHubRepo';
import { ISlackTeamInfo } from '../interfaces/ISlackTeamInfo';
import * as keytar from '../keytar';
import * as memento from '../memento';

const GITHUB_CONNECTOR_TYPE = 'GitHub';
const SLACK_CONNECTOR_TYPE = 'Slack';

export const KNOWN_CONNECTOR_TYPES: TKnowConnectors[] = [
    GITHUB_CONNECTOR_TYPE,
    SLACK_CONNECTOR_TYPE,
];
export type TKnowConnectors =
    | typeof GITHUB_CONNECTOR_TYPE
    | typeof SLACK_CONNECTOR_TYPE;

interface IConnectorBase {
    id: string;
    type: TKnowConnectors;
    name: string;
    accessTokenKeytarKey: string;
}

export interface IGitHubConnector extends IConnectorBase {
    type: typeof GITHUB_CONNECTOR_TYPE;
    repo: IGithubRepo;
}

export interface ISlackConnector extends IConnectorBase {
    type: typeof SLACK_CONNECTOR_TYPE;
    team: ISlackTeamInfo;
}

type TConnectors = IGitHubConnector | ISlackConnector;

const CONNECTORS_MEMENTO_KEY = 'tgzr.connector-repository.connectors';

export class ConnectorRepository {
    private get connectors(): TConnectors[] {
        const records = memento.get<TConnectors[] | undefined>(
            CONNECTORS_MEMENTO_KEY
        );

        return records || [];
    }

    private set connectors(connectors: TConnectors[]) {
        memento.set(CONNECTORS_MEMENTO_KEY, connectors);
    }

    public async addGitHubConnector(
        name: string,
        repo: IGithubRepo,
        token: string
    ) {
        const id = uuid();
        const accessTokenKeytarKey = `${CONNECTORS_MEMENTO_KEY}.${name}.${id}`;

        this.connectors = [
            ...this.connectors,
            {
                type: 'GitHub',
                name,
                id,
                repo,
                accessTokenKeytarKey,
            },
        ];

        await keytar.set(accessTokenKeytarKey, token);
    }

    public async addSlackConnector(
        name: string,
        team: ISlackTeamInfo,
        token: string
    ) {
        const id = uuid();
        const accessTokenKeytarKey = `${CONNECTORS_MEMENTO_KEY}.${name}.${id}`;

        this.connectors = [
            ...this.connectors,
            {
                type: 'Slack',
                name,
                id,
                team,
                accessTokenKeytarKey,
            },
        ];

        await keytar.set(accessTokenKeytarKey, token);
    }

    public removeConnector(id: string) {
        const newConnectors = this.connectors.filter((r) => {
            return r.id !== id;
        });

        this.connectors = newConnectors;
    }

    public async removeAllConnectors() {
        for (let connector of this.connectors) {
            await keytar.remove(connector.accessTokenKeytarKey);

            this.removeConnector(connector.id);
        }
    }

    public getConnector = (id: string) => {
        const connector = this.connectors.find((r) => {
            return r.id === id;
        });

        return connector;
    };

    public getConnectors() {
        return [...this.connectors];
    }
}

export const connectorRepository = new ConnectorRepository();
