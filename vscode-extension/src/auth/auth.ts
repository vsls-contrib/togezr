import { authentication, AuthenticationProvider, EventEmitter } from 'vscode';
import { SupportedAuthProviders } from './SupportedAuthProviders';

export const isAllProvidersInitialized = (
    providers: AuthenticationProvider[]
): boolean => {
    for (let provider in SupportedAuthProviders) {
        const initializedProvider = providers.find((p) => {
            return p.id === provider;
        });
        if (!initializedProvider) {
            return false;
        }
    }
    return true;
};

export class Auth {
    private initEventEmitter = new EventEmitter();

    constructor() {
        authentication.onDidChangeAuthenticationProviders((e) => {
            if (isAllProvidersInitialized(authentication.providers)) {
                this.initEventEmitter.fire();
            }
        });
    }

    public getCachedGithubPullRequestToken = async (): Promise<
        string | null
    > => {
        await this.initEventEmitter.event;

        // const token = await authentication.login('github', [
        //     'read:user',
        //     'user:email',
        //     'repo',
        // ]);

        // return await token.getAccessToken();

        const sessions = await authentication.getSessions('github', [
            'read:user',
            'user:email',
            'repo',
        ]);

        if (!sessions.length) {
            return null;
        }

        return await sessions[0].getAccessToken();
    };

    public getCachedTeamsToken = async (): Promise<string | null> => {
        await this.initEventEmitter.event;

        const sessions = await authentication.getSessions('microsoft', [
            'user.read',
        ]);

        if (!sessions.length) {
            return null;
        }

        return await sessions[0].getAccessToken();
    };

    public loginToTeams = async (): Promise<string | null> => {
        await this.initEventEmitter.event;

        const session = await authentication.login('microsoft', [
            'https://graph.microsoft.com/user.read',
        ]);

        return await session.getAccessToken();
    };
}

export const auth = new Auth();
