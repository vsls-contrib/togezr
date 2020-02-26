import { Repository } from 'src/typings/git';
import * as vsls from 'vsls';
import { ISessionConnector } from '../branchBroadcast/interfaces/ISessionConnector';
import { getConnector } from '../commands/addConnectorCommand';
import {
    getBranchRegistryRecord,
    IRegistryData,
    setRegistryRecordRunning,
} from '../commands/registerBranch/branchRegistry';

export class SessionConnectorHub {
    private registryData: IRegistryData;

    private sessionConnectors: ISessionConnector[] = [];

    constructor(vslsApi: vsls.LiveShare, id: string, repo?: Repository) {
        const registryData = getBranchRegistryRecord(id);
        if (!registryData) {
            throw new Error('No registry data found.');
        }

        this.registryData = registryData;

        const { connectorsData } = registryData;

        for (let connector of connectorsData) {
            const ConnectorClass = getConnector(connector.type);

            this.sessionConnectors.push(
                new ConnectorClass(
                    vslsApi,
                    id,
                    connector,
                    connectorsData,
                    registryData,
                    repo
                )
            );
        }
    }

    public async init() {
        const connectorsResult = this.sessionConnectors.map((connector) => {
            return connector.init();
        });

        await Promise.all(connectorsResult);
    }

    public async dispose() {
        const connectorsResult = this.sessionConnectors.map((connector) => {
            return connector.dispose();
        });

        setRegistryRecordRunning(this.registryData.id, false);

        await Promise.all(connectorsResult);
    }
}
