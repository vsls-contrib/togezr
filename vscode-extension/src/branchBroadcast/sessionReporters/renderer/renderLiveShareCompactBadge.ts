export const renderLiveShareCompactBadge = (sessionId: string) => {
    return `[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=${sessionId}&v=${Date.now()})](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId})`;
};
