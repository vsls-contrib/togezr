import * as uuid from 'uuid/v4';
import * as keytar from '../keytar';
import * as memento from '../memento';

const GITHUB_REPORTER_TYPE = 'GitHub';

export const KNOWN_REPORTER_TYPES: TKnowReporters[] = [GITHUB_REPORTER_TYPE];
export type TKnowReporters = typeof GITHUB_REPORTER_TYPE;

interface IReporterBase {
    id: string;
    type: TKnowReporters;
    name: string;
    accessTokenKeytarKey: string;
}

interface IGitHubReporter extends IReporterBase {
    type: typeof GITHUB_REPORTER_TYPE;
    githubRepoUrl: string;
}

type TReporters = IGitHubReporter;

const REPORTERS_MEMENTO_KEY = 'tgzr.reporter-repository.reporters';

export class ReporterRepository {
    private get reporters(): TReporters[] {
        const records = memento.get<TReporters[] | undefined>(
            REPORTERS_MEMENTO_KEY
        );

        return records || [];
    }

    private set reporters(reporters: TReporters[]) {
        memento.set(REPORTERS_MEMENTO_KEY, reporters);
    }

    public addReporter(reporter: TReporters) {
        this.reporters = [...this.reporters, reporter];
    }

    public addGitHubReporter(
        name: string,
        githubRepoUrl: string,
        token: string
    ) {
        const id = uuid();
        const accessTokenKeytarKey = `${REPORTERS_MEMENTO_KEY}.${name}.${id}`;

        this.reporters = [
            ...this.reporters,
            {
                type: 'GitHub',
                name,
                id,
                githubRepoUrl,
                accessTokenKeytarKey,
            },
        ];

        keytar.set(accessTokenKeytarKey, token);
    }

    public removeReporter(id: string) {
        const newReporters = this.reporters.filter((r) => {
            return r.id !== id;
        });

        this.reporters = newReporters;
    }

    public async removeAllReporters() {
        for (let reporter of this.reporters) {
            await keytar.set(reporter.accessTokenKeytarKey, undefined);
        }
    }

    public getReporters() {
        return [...this.reporters];
    }
}

export const reporterRepository = new ReporterRepository();
