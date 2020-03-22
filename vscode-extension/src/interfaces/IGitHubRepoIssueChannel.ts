import { IChannel } from './IChannel';
import { IGithubRepo } from './IGitHubRepo';
import { IShortGitHubIssue } from './IShortGitHubIssue';
import { TGitHubChannelType } from './TGitHubChannel';

export interface IGitHubRepoIssueChannel extends IChannel {
    type: TGitHubChannelType;
    repo: IGithubRepo;
    issue: IShortGitHubIssue;
}
