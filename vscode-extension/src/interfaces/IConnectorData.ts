import { TKnowConnectors } from '../connectorRepository/connectorRepository';

export interface IConnectorData {
    id: string;
    data?: any;
    type: TKnowConnectors;
}
