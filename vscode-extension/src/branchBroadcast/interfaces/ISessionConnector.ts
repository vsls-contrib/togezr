export interface ISessionConnector {
    init: () => Promise<ISessionConnector>;
    dispose: () => Promise<void>;
    // reportSessionStart: () => Promise<void>;
    // reportSessionGuest: (guest: IGuest) => Promise<void>;
}
