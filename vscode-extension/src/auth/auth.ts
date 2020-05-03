import { authentication, EventEmitter } from 'vscode';

// export const isAllProvidersInitialized = (
//     providers: AuthenticationProvider[]
// ): boolean => {
//     for (let provider in SupportedAuthProviders) {
//         const initializedProvider = providers.find((p) => {
//             return p.id === provider;
//         });
//         if (!initializedProvider) {
//             return false;
//         }
//     }
//     return true;
// };

const GITHUB_SCOPES = ['read:user', 'user:email', 'repo'];

export class Auth {
    private initEventEmitter = new EventEmitter();

    // constructor() {
    //     authentication.onDidChangeAuthenticationProviders((e) => {
    //         if (isAllProvidersInitialized(authentication.providers)) {
    //             this.initEventEmitter.fire();
    //         }
    //     });
    // }

    public getCachedGithubToken = async (): Promise<string | null> => {
        await this.initEventEmitter.event;

        const sessions = await authentication.getSessions(
            'github',
            GITHUB_SCOPES
        );

        if (!sessions.length) {
            return null;
        }

        return await sessions[0].getAccessToken();
    };

    public loginWithGithub = async (): Promise<string | null> => {
        await this.initEventEmitter.event;

        try {
            const token = await authentication.login('github', GITHUB_SCOPES);

            return await token.getAccessToken();
        } catch (e) {
            return null;
        }
    };

    public getChacedTokenOrLoginGithub = async (): Promise<string | null> => {
        await this.initEventEmitter.event;

        const token = await this.getCachedGithubToken();
        if (typeof token === 'string' && token.trim()) {
            return token;
        }

        return await this.loginWithGithub();
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
