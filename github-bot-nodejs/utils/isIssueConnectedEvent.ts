import { isIssueClosedOrReopenned } from './isIssueClosedOrReopenned';
export const isIssueConnectedEvent = (body: any) => {
    const isEdited = (body.action === 'edited');
    
    return (isEdited || isIssueClosedOrReopenned(body)) && body.issue;
};
