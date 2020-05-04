import { getGithubAPI } from '../github/githubAPI';
import { TChannelType } from '../interfaces/TChannel';
import { TGitHubChannel } from '../interfaces/TGitHubChannel';
import { renderGitHubComment } from '../renderers/github/renderGitHubComment';
import { ISessionEvent } from '../sessionConnectors/renderer/events';
import { ChannelSession, IChannelMementoRecord } from './ChannelSession';

declare type IssuesCreateCommentResponseUser = {
    avatar_url: string;
    events_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    gravatar_id: string;
    html_url: string;
    id: number;
    login: string;
    node_id: string;
    organizations_url: string;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    type: string;
    url: string;
};

declare type IssuesCreateCommentResponse = {
    body: string;
    created_at: string;
    html_url: string;
    id: number;
    node_id: string;
    updated_at: string;
    url: string;
    user: IssuesCreateCommentResponseUser;
};

export class GitHubChannelSession extends ChannelSession {
    private commentId?: number;

    public type: TChannelType | 'generic' = 'github-issue';

    constructor(
        public channel: TGitHubChannel,
        public siblingChannels: ChannelSession[],
        public sessionId?: string
    ) {
        super(channel, siblingChannels, sessionId);
    }

    public async onEvent(e: ISessionEvent) {
        await super.onEvent(e);

        const comment = await renderGitHubComment(this.events, this.channel);
        await this.updateGitHubComment(comment);

        /**
         * Don't add comment for end session, this is the
         * responsibility of the services after some time of
         * inactivity since the user can restart the same session.
         */
        //
        if (e.type === 'end-session') {
            return;
        }
    }

    private updateGitHubComment = async (commentBody: string) => {
        const api = await getGithubAPI(this.channel.account.name);

        const repoUrl = this.channel.issue.repository_url;
        const split = repoUrl.split('/');

        const owner = split[4];
        const repo = split[5];

        const options = {
            body: commentBody,
            issue_number: this.channel.issue.number,
            owner,
            repo,
        };

        let commentResult;
        if (this.commentId == null) {
            commentResult = await api.issues.createComment(options);
        } else {
            commentResult = await api.issues.updateComment({
                comment_id: this.commentId,
                ...options,
            });
        }

        if (commentResult.status >= 300) {
            throw new Error('GitHub issue comment API call failed.');
        }

        const { data } = commentResult;
        this.commentId = data.id;
    };

    public readExistingRecord() {
        const record = super.readExistingRecord();

        if (!record) {
            return null;
        }

        const { data } = record;
        if (!data) {
            return null;
        }

        const { commentId } = data;
        if (typeof commentId !== 'number') {
            this.deleteExistingRecord();
            return null;
        }

        this.commentId = commentId;

        return record;
    }

    public onPersistData = (record: IChannelMementoRecord) => {
        if (!this.commentId) {
            return record;
        }

        return {
            ...record,
            data: {
                commentId: this.commentId,
            },
        };
    };
}
