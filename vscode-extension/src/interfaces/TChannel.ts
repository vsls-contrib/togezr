import { TGitHubChannel, TGitHubChannelType } from './TGitHubChannel';
import { TSlackChannel, TSlackChannelType } from './TSlackChannel';

export type TChannel = TSlackChannel | TGitHubChannel;
export type TChannelType = TSlackChannelType | TGitHubChannelType;
