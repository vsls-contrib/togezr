export interface ISlackTeamInfo {
    id: string;
    name: string;
    domain: string;
    email_domain: string;
    icon: {
        image_default: boolean;
    } & {
        [key: string]: string;
    };
}
