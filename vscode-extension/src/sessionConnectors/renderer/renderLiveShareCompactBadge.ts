export const renderLiveShareCompactBadge = (sessionId: string) => {
    // const nextSession = encodeURIComponent(
    //     new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString()
    // );

    // &date=${nextSession}

    return `[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=${sessionId}&v=${Date.now()})](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId})`;
};
