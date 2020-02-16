import { TKnowConnectors } from '../../connectorRepository/connectorRepository';
import { GitHubConnectorRegistrationInitializer } from './gitHubConnectorRegistrationInitializer';
import { SlackConnectorRegistrationInitializer } from './slackConnectorRegistrationInitializer';

export const getConnectorRegistrationInitializer = (
    connectorType: TKnowConnectors
) => {
    if (connectorType === 'GitHub') {
        return new GitHubConnectorRegistrationInitializer();
    }
    if (connectorType === 'Slack') {
        return new SlackConnectorRegistrationInitializer();
    }
};
