import { Event, EventEmitter, Uri, UriHandler } from 'vscode';

interface ITokenResponse {
    token: string;
    state: string;
}

export class GitHubTokensResolver {
    private readonly onTokenEventEmitter = new EventEmitter<ITokenResponse>();
    public readonly onToken: Event<ITokenResponse>;

    constructor() {
        this.onToken = this.onTokenEventEmitter.event;
    }

    public reportNewToken(token: string, state: string) {
        this.onTokenEventEmitter.fire({ token, state });
    }
}

const gitHubAuth = (uri: Uri) => {};

export class ProtocolHandler implements UriHandler {
    constructor() {}

    public async handleUri(uri: Uri): Promise<void> {
        const { path } = uri;
        const cleanPath = path.split('?')[0];

        switch (cleanPath) {
            /* /github-auth?token={token} */
            case '/github-auth': {
                return gitHubAuth(uri);
            }

            default: {
                break;
            }
        }
    }

    public dispose(): void {}
}
