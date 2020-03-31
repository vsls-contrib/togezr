import { TGitHubChannel, TGitHubChannelType } from './TGitHubChannel';
import { TSlackChannel, TSlackChannelType } from './TSlackChannel';
import { TTeamsChannel, TTeamsChannelType } from './TTeamsChannel';

export type TChannel = TSlackChannel | TGitHubChannel | TTeamsChannel;

export type TChannelType =
    | TSlackChannelType
    | TGitHubChannelType
    | TTeamsChannelType;
