interface ITeamsScopedEmail {
    address: string;
    relevanceScore: number;
    selectionLikelihood: string;
}
interface ITeamsPhone {
    type: 'business' | 'home';
    number: string;
}
interface ITeamsPersonType {
    class: string;
    subclass: string;
}
export interface ITeamsUser {
    id: string;
    displayName: string;
    givenName: string;
    surname: string;
    isFavorite: boolean;
    jobTitle: string;
    companyName: string;
    department: string;
    officeLocation: string;
    userPrincipalName: string;
    imAddress: string;
    birthday: string | null;
    personNotes: string | null;
    profession: string | null;
    yomiCompany: string | null;
    scoredEmailAddresses: ITeamsScopedEmail[];
    phones: ITeamsPhone[];
    personType: ITeamsPersonType;
}
