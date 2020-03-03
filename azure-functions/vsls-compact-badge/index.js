const https = require('https');
const time = require('pretty-ms');

const getSessionInfo = async (query) => {
    const { sessionId, date } = query;

    let data = {};

    if (date) {
        const dateString = decodeURIComponent(date);
        const timeDelta = new Date(dateString).getTime() - Date.now();
        if (timeDelta >= -(30 * 60 * 1000)) {
            const timeDeltaString = time(timeDelta, { compact: true });

            data = {
                startsIn: timeDeltaString
            };
        }
    }

    return new Promise((resolve) => {
        const req = https.request(`https://prod.liveshare.vsengsaas.visualstudio.com/api/v0.2/workspace/${sessionId}/owner/`, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    resolve({
                        ...data,
                        ...JSON.parse(body)
                    });
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (error) => {
            resolve(null);
        });

        req.end();
    });
}

const sessionInfoToImage = (sessionInfo) => {
    if (!sessionInfo) {
        return `<svg width="48px" height="11px" viewBox="0 0 48 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect id="Rectangle" fill="#F25D5D" x="0" y="0" width="48" height="11" rx="2"></rect>
                <text id="Not-Found" font-family="Arial-BoldMT, Arial" font-size="8" font-weight="bold" letter-spacing="0.05" fill="#000000">
                    <tspan x="4" y="8">Not Found</tspan>
                </text>
            </g>
        </svg>`;
    }

    if (sessionInfo.connected) {
        return `<svg width="57px" height="11px" viewBox="0 0 57 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect id="Rectangle" fill="#2D9B35" x="0" y="0" width="57" height="11" rx="2"></rect>
            <text id="⚡Live:-Join" font-family="AppleColorEmoji, Apple Color Emoji" font-size="6" font-weight="normal" letter-spacing="0.0375" fill="#FFFFFF">
                <tspan x="2" y="8">⚡</tspan>
                <tspan x="10.0375" y="8" font-family="ArialMT, Arial" font-size="8" letter-spacing="0.05">Live:</tspan>
                <tspan x="30" y="8" font-family="Arial-BoldMT, Arial" font-size="8" font-weight="bold" letter-spacing="0.05">Join</tspan>
            </text>
            <polygon id="Path" fill="#FFFFFF" points="50 3.5 50 7.5 53.1134082 5.5"></polygon>
        </g>
    </svg>
        `;
    }

    if (sessionInfo.startsIn) {
        return `<svg width="67px" height="11px" viewBox="0 0 67 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect id="Rectangle" fill="#452D9B" x="0" y="0" width="67" height="11" rx="2"></rect>
            <text id="next-in:" font-family="ArialMT, Arial" font-size="8" font-weight="normal" letter-spacing="0.05" fill="#FFFFFF">
                <tspan x="15" y="8">next in:</tspan>
                <tspan x="41.1929688" y="8" font-family="Arial-BoldMT, Arial" font-weight="bold"> </tspan>
            </text>
            <text id="📅" font-family="AppleColorEmoji, Apple Color Emoji" font-size="6" font-weight="normal" letter-spacing="0.0375" fill="#FFFFFF">
                <tspan x="4" y="7.5">📅</tspan>
            </text>
            <text id="~12d" font-family="Arial-BoldMT, Arial" font-size="8" font-weight="bold" letter-spacing="0.05" fill="#FFFFFF" text-anchor="middle">
                <tspan x="53" y="8">${sessionInfo.startsIn}</tspan>
            </text>
        </g>
    </svg>`;
    }

    if (!sessionInfo.connected) {
        return `<svg width="34px" height="11px" viewBox="0 0 34 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect id="Rectangle" fill="#B2B2B2" x="0" y="0" width="34" height="11" rx="2"></rect>
            <text id="Offline" font-family="Arial-BoldMT, Arial" font-size="8" font-weight="bold" letter-spacing="0.05" fill="#000000">
                <tspan x="4" y="8">Offline</tspan>
            </text>
        </g>
    </svg>`;
    }
};

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (!req.query.sessionId) {
        context.res = {
            status: 400,
            body: 'No `sessonId` set.'
        };

        return;
    }

    const sessionInfo = await getSessionInfo(req.query);
    context.res = {
        status: 200,
        body: sessionInfoToImage(sessionInfo),
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache': 'no-cache',
            'ETag': `${Date.now()}`,
            'Expires': `${new Date(Date.now() + 1000).toUTCString()}`,
            'Pragma': 'no-cache'
        }
    }
};
