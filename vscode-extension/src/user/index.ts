import { UserInfo } from 'vsls';
import { DEFAULT_GITHUB_AVATAR } from '../sessionConnectors/constants';
import { githubAvatarRepository } from '../sessionConnectors/github/githubAvatarsRepository';

export class User {
    constructor(private user: UserInfo) {}

    private linkPrefix = 'https://github.com';

    get displayName() {
        return this.user.displayName;
    }

    get emailAddress() {
        return this.user.emailAddress;
    }

    get id() {
        return this.user.id;
    }

    get userName() {
        return this.user.userName;
    }

    public getUserAvatarLink = async () => {
        if (this.user.userName) {
            return await githubAvatarRepository.getAvatarFor(
                this.user.userName
            );
        }

        return DEFAULT_GITHUB_AVATAR;
    };

    public getSlackUserLink = () => {
        const result = this.user.userName
            ? `<${this.linkPrefix}/${this.user.userName}|${this.user.displayName}>`
            : this.user.displayName;

        return result;
    };

    public getMarkdownUserLink = () => {
        return this.user.userName
            ? `[${this.user.displayName}](${this.linkPrefix}/${this.user.userName})`
            : this.user.displayName;
    };

    public getHtmlUserLink = () => {
        return this.user.userName
            ? `<a href="${this.linkPrefix}/${this.user.userName}">${this.user.displayName}</a>`
            : this.user.displayName;
    };
}
