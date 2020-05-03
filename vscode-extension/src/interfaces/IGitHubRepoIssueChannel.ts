import { IChannel } from './IChannel';
import { IShortGithubRepo } from './IGitHubRepo';
import { IShortGitHubIssue } from './IShortGitHubIssue';
import { TGitHubChannelType } from './TGitHubChannel';

export interface IGitHubRepoIssueChannel extends IChannel {
    type: TGitHubChannelType;
    repo: IShortGithubRepo;
    issue: IShortGitHubIssue;
}
