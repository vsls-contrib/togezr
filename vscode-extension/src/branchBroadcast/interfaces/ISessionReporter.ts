export interface ISessionReporter {
    reportSessionStart: () => Promise<void>;
    reportSessionGuest: (guest: IGuest) => Promise<void>;
}
