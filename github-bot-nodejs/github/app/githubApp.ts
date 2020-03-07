import { Octokit } from '@octokit/rest';
import { App as OctokitApp } from '@octokit/app';
import { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY } from '../constants';

const CACHE = {};
const OCTOKIT_REST_CACHE = {};

export class GithubAppTokenSigner {
    private readonly app: OctokitApp;

    public rest = (auth: string) => {
        if (OCTOKIT_REST_CACHE[auth]) {
            return OCTOKIT_REST_CACHE[auth];
        }

        const octo = new Octokit({
            auth
        });

        OCTOKIT_REST_CACHE[auth] = octo;

        return octo;
    }

    constructor() {
        this.app = new OctokitApp({
            id: GITHUB_APP_ID,
            privateKey: GITHUB_APP_PRIVATE_KEY,
            cache: {
                get(key) {
                  return CACHE[key];
                },
                set(key, value) {
                  CACHE[key] = value;
                }
              }
        });
    }

    public getToken = async (installationId: number | string) => {
        await this.app.getSignedJsonWebToken();

        const installationAccessToken = await this.app.getInstallationAccessToken({
            installationId: parseInt(`${installationId}`, 10)
        });

        return installationAccessToken;
    }
}

export const githubApp = new GithubAppTokenSigner();