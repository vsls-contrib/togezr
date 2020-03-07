import * as express from 'express';
const bodyParser = require('body-parser');
import * as dotenv from 'dotenv';

dotenv.config();

import { handleIssueUpdate } from './github/handleIssueUpdate';
import { trace } from './trace';
import { handleIssueSessionComment } from './github/handleIssueSessionComment';

const PORT = process.env.PORT || 3000;

const isIssueConnectedEvent = (body: any) => {
    const isEdited = (body.action === 'edited');
    const isClosed = (body.action === 'closed');
    const isReopened = (body.action === 'reopened');

    return (isEdited || isClosed || isReopened) && body.issue;
}

const app = express();

app.use(bodyParser.json());

app.post('/', async (req, res) => {
    try {
        const { body, method, url } = req;

        trace.info('Request received:', method, url);

        if (isIssueConnectedEvent(body)) {
            trace.info('Handle issue update.', body);
            await handleIssueUpdate(body);
        }

        if (body.action === 'created' && body.comment) {
            trace.info('Handle issue session comment.');
            await handleIssueSessionComment(body);
        }
    } catch (e) {
        trace.error(e.message, e.stack);
    }
})
 
app.listen(PORT);

console.log(`Server running at http://localhost:${PORT}`);
