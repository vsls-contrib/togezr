import { Repository } from 'src/typings/git';
import * as vsls from 'vsls';
import { getReporter } from '../../commands/addReporterCommand';
import { getBranchRegistryRecord } from '../../commands/registerBranch/branchRegistry';
import { ISessionReporter } from '../interfaces/ISessionReporter';

export class SessionReporterHub {
    private sessionReporters: ISessionReporter[] = [];

    constructor(
        vslsApi: vsls.LiveShare,
        repoId: string,
        branchName: string,
        repo: Repository
    ) {
        const registryData = getBranchRegistryRecord(repoId, branchName);
        if (!registryData) {
            throw new Error('No registry data found.');
        }

        const { reportersData } = registryData;

        for (let reporter of reportersData) {
            const ReporterClass = getReporter(reporter.type);

            this.sessionReporters.push(
                new ReporterClass(vslsApi, repoId, branchName, repo, reporter)
            );
        }
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
