import { TKnowReporters } from '../reporterRepository/reporterRepository';

export interface IReporterData {
    id: string;
    data?: any;
    type: TKnowReporters;
}

export type IReportersData = IReporterData[];
