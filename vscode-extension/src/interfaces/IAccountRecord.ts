import { TAccountType } from './TAccountType';

export interface IAccountRecord {
    type: TAccountType;
    name: string;
    token: string;
}
