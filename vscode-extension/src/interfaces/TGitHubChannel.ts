import { GITHUB_REPO_ISSUE_CHANNEL_TYPE } from '../constants';
import { IGitHubRepoIssueChannel } from './IGitHubRepoIssueChannel';

type TGitHubRepoIssueChannelType = typeof GITHUB_REPO_ISSUE_CHANNEL_TYPE;

export type TGitHubChannelType = TGitHubRepoIssueChannelType;
export type TGitHubChannel = IGitHubRepoIssueChannel;
