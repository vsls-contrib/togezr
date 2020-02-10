export interface ISessionReporter {
    init: () => Promise<ISessionReporter>;
    dispose: () => Promise<void>;
    // reportSessionStart: () => Promise<void>;
    // reportSessionGuest: (guest: IGuest) => Promise<void>;
}
