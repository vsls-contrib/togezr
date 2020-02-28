const https = require('https');
const url = require('url');
const fetch = require('node-fetch');

/**
 * GitHub will redirect to this endpoint with and `authorization code`
 * we need to exchange it for the access token and render on the page
 */
module.exports = async function (context, req) {
    if (!req.query.code) {
        context.res = {
            status: 400,
            body: "No code query param found."
        };

        return;
    }

    try {
        const { code } = req.query;

        const result = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new url.URLSearchParams([
                ['code', code],
                ['client_id', process.env['GITHUB_CLIENT_ID']],
                ['client_secret', process.env['GITHUB_CLIENT_SECRET']]
            ]).toString()
        });

        if (!result.ok) {
            context.res = {
                status: 400,
                body: "Failed to exchange GitHub token."
            };

            return;
        }

        const resultText = await result.text() || '';

        if (!resultText.trim()) {
            context.res = {
                status: 400,
                body: "Cannot get body text."
            };

            return;
        }

        const resultQuery = new url.URLSearchParams(resultText);

        const error = resultQuery.get('error');
        const errorDetails = resultQuery.get('error_description');

        if (error) {
            context.res = {
                status: 500,
                body: `GitHub returned and error: ${errorDetails}`
            };

            return;
        }
        
        const accessToken = resultQuery.get('access_token');
        if (!accessToken) {
            context.res = {
                status: 500,
                body: `GitHub exchange request succeed but no access token found`
            };

            return;
        }

        context.res = {
            status: 200,
            body: `Your GitHub token: ${accessToken}`
        };
    } catch (e) {
        context.res = {
            status: 500,
            body: `Error happened, ${e.message}`
        };
    }
};