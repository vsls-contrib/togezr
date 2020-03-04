import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { handleIssueUpdate } from './github/handleIssueUpdate';
import { trace } from './trace';
import { handleIssueSessionComment } from './github/handleIssueSessionComment';

const isIssueConnectedEvent = (body: any) => {
    const isEdited = (body.action === 'edited');
    const isClosed = (body.action === 'closed');
    const isReopened = (body.action === 'reopened');

    return (isEdited || isClosed || isReopened) && body.issue;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    trace.initializeTrace(context);
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
};

export default httpTrigger;
