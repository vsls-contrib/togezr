import fetch from 'node-fetch';
import { IGist } from '../interfaces/IGist';
import * as memento from '../memento';

// interface ISessionRecord {
//     time: number;
//     liveshareSessionId: string;
//     updateTimestamp: number;
// }

// interface IGistSessionSchedulerRepo {
//     [key: string]: ISessionRecord;
// }

// const GIST_SESSION_SCHEDULER_KEYTAR_KEY =
//     'TOGEZR_GIST_SESSION_SCHEDULER_KEYTAR_KEY';

const GIST_SESSION_SCHEDULER_GIST_ID_KEY =
    'TOGEZR_GIST_SESSION_SCHEDULER_GIST_ID_KEY';

export class GistSessionScheduler {
    private token?: string;
    // private gist?: IGist;

    public init = async () => {
        // const token = memento.get<string | undefined>(
        //     GIST_SESSION_SCHEDULER_KEYTAR_KEY
        // );

        this.token = '0f9141bcfbd4adc502a188d4ddedf83925d505b5';

        const gist = memento.get<IGist | undefined>(
            GIST_SESSION_SCHEDULER_GIST_ID_KEY
        );

        if (!gist) {
            await this.createGist();
        }
    };

    private createGist = async () => {
        if (!this.token) {
            throw new Error('No GitHub token is set.');
        }

        const result = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: { ['index.json']: { content: '{}' } },
                description: 'Togezr LiveShare sessions schedule',
                public: false,
            }),
        });

        if (!result.ok) {
            throw new Error('Github request failed.');
        }

        const gist = (await result.json()) as IGist;
        memento.set(GIST_SESSION_SCHEDULER_GIST_ID_KEY, gist);

        // this.gist = gist;
    };

    // private saveSchedulerDetails() {}

    public setSessionTime(sessionId: string, nextSessionTime: number) {
        // memento
    }
}

export const gistSessionScheduler = new GistSessionScheduler();
