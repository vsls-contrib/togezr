import { IGithubIssue } from './IGithubIssue';

export interface IIssueTogezrFooter {
    badge: string;
    users?: string;
    branch: string;
    issue: IGithubIssue;
}
