import * as express from 'express';
const bodyParser = require('body-parser');
import * as dotenv from 'dotenv';

dotenv.config();

import { handleIssueUpdate } from './github/handleIssueUpdate';
import { trace } from './trace';
import { handleIssueSessionComment } from './github/handleIssueSessionComment';
import { isIssueConnectedEvent } from './utils/isIssueConnectedEvent';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.post('/', async (req, res) => {
    try {
        const { body, method, url } = req;

        trace.info('Request received:', method, url);

        if (isIssueConnectedEvent(body)) {
            trace.info('Handle issue update.', Object.keys(body));
            await handleIssueUpdate(body);
        }

        if (body.action === 'created' && body.comment) {
            trace.info('Handle issue session comment.', Object.keys(body));
            await handleIssueSessionComment(body);
        }
    } catch (e) {
        trace.error(e.message, e.stack);
    }
})
 
app.listen(PORT);

console.log(`Server running at http://localhost:${PORT}`);
