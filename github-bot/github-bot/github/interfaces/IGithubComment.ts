import { IGithubUser } from './IGithubUser';
export interface IGithubComment {
    url: string;
    html_url: string;
    issue_url: string;
    user: IGithubUser;
    id: number;
    node_id: string;
    created_at: string;
    updated_at: string;
    author_association: 'OWNER';
    body: string | null;
}
