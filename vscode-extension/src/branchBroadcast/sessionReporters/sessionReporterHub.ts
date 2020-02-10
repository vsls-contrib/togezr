import { Repository } from 'src/typings/git';
import * as vsls from 'vsls';
import { ISessionReporter } from '../interfaces/ISessionReporter';
import { GithubSessionReporter } from './githubSessionReporter';

export class SessionReporterHub {
    private sessionReporters: ISessionReporter[] = [];

    constructor(
        vslsApi: vsls.LiveShare,
        repoId: string,
        branchName: string,
        repo: Repository
    ) {
        this.sessionReporters.push(
            new GithubSessionReporter(vslsApi, repoId, branchName, repo)
        );
    }

    public async init() {
        const reportersResult = this.sessionReporters.map((reporter) => {
            return reporter.init();
        });

        await Promise.all(reportersResult);
    }

    public async dispose() {
        const reportersResult = this.sessionReporters.map((reporter) => {
            return reporter.dispose();
        });

        await Promise.all(reportersResult);
    }

    // public reportSessionStart = async () => {
    //     const reportersResult = this.sessionReporters.map((reporter) => {
    //         return reporter.reportSessionStart();
    //     });

    //     await Promise.all(reportersResult);
    // };

    // public reportSessionGuest = async (guest: IGuest) => {
    //     const reportersResult = this.sessionReporters.map((reporter) => {
    //         return reporter.reportSessionGuest(guest);
    //     });

    //     await Promise.all(reportersResult);
    // };
}
