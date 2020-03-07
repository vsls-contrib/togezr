import { IGithubIssue } from './IGithubIssue';
import { IGithubComment } from './IGithubComment';
import { IGithubRepo } from './IGithubRepo';
import { IGithubUser } from './IGithubUser';
import { IGithubInstallationShort } from './IGithubInstallation';

export interface IGithubIssueSessionCommentEvent {
    action: 'created';
    issue: IGithubIssue;
    comment: IGithubComment;
    repository: IGithubRepo;
    sender: IGithubUser;
    installation: IGithubInstallationShort;
}
