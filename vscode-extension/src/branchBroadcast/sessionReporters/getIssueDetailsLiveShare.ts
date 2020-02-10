import { IRegistryData } from '../../commands/registerBranch/branchRegistry';

export const getIssueDetailsLiveShare = (data: IRegistryData) => {
    const { sessionId } = data;
    return `[![Live Share](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-badge?sessionId=${sessionId}&v=${Date.now()})](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId})`;
};
