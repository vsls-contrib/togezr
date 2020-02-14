export const renderLiveShareCompactBadge = (sessionId: string) => {
    const nextSession = encodeURIComponent(
        new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString()
    );

    return `[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=${sessionId}&date=${nextSession}&v=${Date.now()})](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId})`;
};
