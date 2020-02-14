import { TKnowConnectors } from '../../connectorRepository/connectorRepository';
import { GitHubConnectorRegistrationInitializer } from './gitHubConnectorRegistrationInitializer';

export const getConnectorRegistrationInitializer = (
    connectorType: TKnowConnectors
) => {
    if (connectorType === 'GitHub') {
        return new GitHubConnectorRegistrationInitializer();
    }
};
