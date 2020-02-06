import { IRegistryData } from 'src/commands/registerBranch/branchRegistry';
import { ISessionReporter } from '../interfaces/ISessionReporter';
import { GithubSessionReporter } from './githubSessionReporter';

export class SessionReporterRegistry {
    private sessionReporters: ISessionReporter[] = [];

    constructor(registryData: IRegistryData) {
        this.sessionReporters.push(new GithubSessionReporter(registryData));
    }

    public reportSessionStart = async () => {
        const reportersResult = this.sessionReporters.map((reporter) => {
            return reporter.reportSessionStart();
        });

        await Promise.all(reportersResult);
    };

    public reportSessionGuest = async (guest: IGuest) => {
        const reportersResult = this.sessionReporters.map((reporter) => {
            return reporter.reportSessionGuest(guest);
        });

        await Promise.all(reportersResult);
    };
}
