import { Repository } from 'src/typings/git';
import { ISessionReporter } from '../interfaces/ISessionReporter';
import { GithubSessionReporter } from './githubSessionReporter';

export class SessionReporterHub {
    private sessionReporters: ISessionReporter[] = [];

    constructor(repoId: string, branchName: string, repo: Repository) {
        this.sessionReporters.push(
            new GithubSessionReporter(repoId, branchName, repo)
        );
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
