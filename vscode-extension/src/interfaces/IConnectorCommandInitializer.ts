export interface IConnectorCommandInitializer {
    init(): Promise<void>;
}
