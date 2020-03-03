import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { handleIssueUpdate } from './github/handleIssueUpdate';
import { IGithubIssue } from './github/interfaces/IGithubIssue';
import { trace } from './trace';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    trace.initializeTrace(context);
    try {
        const { body, method, url } = req;

        trace.info('Request received:', method, url);

        if (body.action === 'edited' && body.issue as IGithubIssue) {
            trace.info('Handle issue update.');
            await handleIssueUpdate(body);
        }
    } catch (e) {
        trace.error(e.message, e.stack);
    }
};

export default httpTrigger;
