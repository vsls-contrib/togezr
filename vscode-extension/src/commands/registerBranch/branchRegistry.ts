import * as vsls from 'vsls';
import { IConnectorData } from '../../interfaces/IConnectorData';
import * as memento from '../../memento';
import uuid = require('uuid');

export interface IGuestWithSessions {
    sessionCount: number;
    data: vsls.UserInfo;
}

export interface IRegistryData {
    isRunning: boolean;
    isExplicitellyStopped: boolean;
    guests: IGuestWithSessions[];
    connectorsData: IConnectorData[];
    isReadOnly: boolean;
    isTemporary: boolean;
    sessionId?: string;
    repoId?: string;
    branchName?: string;
    repoRootPath: string;
    id: string;
}

const defaultRegistryData: IRegistryData = {
    id: '',
    repoId: '',
    branchName: '',
    repoRootPath: '',
    guests: [],
    connectorsData: [],
    isReadOnly: false,
    isTemporary: false,
    isRunning: false,
    isExplicitellyStopped: true,
};

interface IRegistryRecords {
    [key: string]: IRegistryData;
}

const BRANCH_REGISTRY_KEY = 'togezr.broadcast.branches.registry';

export interface IBranchRegistrationOptions {
    repoId?: string;
    branchName?: string;
    connectorsData: IConnectorData[];
    isReadOnly: boolean;
    isTemporary?: boolean;
    repoRootPath: string;
}

export const setLiveshareSessionForBranchRegitryRecord = (
    id: string,
    sessionId: string
) => {
    const record = getBranchRegistryRecord(id);

    if (!record) {
        return;
    }

    setBranchRegistryRecord(record.id, {
        ...record,
        sessionId,
    });
};

export const getRegistryRecords = (): IRegistryRecords => {
    const data = memento.get<IRegistryRecords | undefined>(BRANCH_REGISTRY_KEY);

    return data || {};
};

export const getBranchRegistryRecord = (
    id: string
): IRegistryData | undefined => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryRecords = getRegistryRecords();

    const registryData = registryRecords[id];

    if (!registryData) {
        return;
    }

    return {
        ...defaultRegistryData,
        ...registryData,
    };
};

export const getBranchRegistryRecordByRepoAndBranch = (
    repoId: string,
    branch: string
): IRegistryData | undefined => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryRecords = getRegistryRecords();

    const registryData = Object.entries(registryRecords).find(
        ([name, value]) => {
            return value.repoId === repoId && value.branchName === branch;
        }
    );

    if (!registryData) {
        return;
    }

    return {
        ...defaultRegistryData,
        ...registryData,
    };
};

export const setBranchRegistryRecord = (
    id: string,
    data: IRegistryData
): void => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryRecords = getRegistryRecords();

    registryRecords[id] = data;
    memento.set(BRANCH_REGISTRY_KEY, registryRecords);
};

export const registerBranch = async (options: IBranchRegistrationOptions) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }
    const {
        branchName,
        repoId,
        connectorsData,
        isReadOnly,
        repoRootPath,
        isTemporary = false,
    } = options;

    const registryData =
        repoId && branchName
            ? getBranchRegistryRecordByRepoAndBranch(repoId, branchName)
            : {};

    const data: IRegistryData = {
        id: uuid(),
        ...defaultRegistryData,
        ...registryData,
        repoId,
        branchName,
        connectorsData,
        isReadOnly,
        isTemporary,
        repoRootPath,
    };

    setBranchRegistryRecord(data.id, data);

    return data;
};

export const unregisterBranch = async (id: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const data = getRegistryRecords();

    delete data[id];

    memento.set(BRANCH_REGISTRY_KEY, data);
};

export const isBranchAlreadyRegistered = (
    repoId: string,
    branchName: string
) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = getBranchRegistryRecordByRepoAndBranch(
        repoId,
        branchName
    );

    return !!registryData;
};

export const setBranchExplicitelyStopped = (id: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(id),
        isExplicitellyStopped: true,
    };

    setBranchRegistryRecord(registryData.id, registryData);
};

export const resetBranchExplicitelyStopped = (id: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(id),
        isExplicitellyStopped: false,
    };

    setBranchRegistryRecord(registryData.id, registryData);
};

export const isBranchExplicitellyStopped = (id: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = getBranchRegistryRecord(id);

    return !!(registryData && registryData.isExplicitellyStopped);
};

export const addBranchBroadcastGuest = (id: string, guest: vsls.UserInfo) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const currentRecord = getBranchRegistryRecord(id);

    const registryData = {
        ...defaultRegistryData,
        ...currentRecord,
    };

    if (!currentRecord) {
        const data = {
            ...registryData,
            guests: [{ sessionCount: 1, data: guest }],
        };

        return setBranchRegistryRecord(registryData.id, data);
    }

    const { guests = [] } = currentRecord;
    const guestRecord = guests.find((g) => {
        return (
            g.data.id === guest.id || g.data.emailAddress === guest.emailAddress
        );
    });

    if (!guestRecord) {
        currentRecord.guests.push({ sessionCount: 1, data: guest });
    } else {
        const host = guests[0];

        guestRecord.sessionCount =
            host === guestRecord
                ? guestRecord.sessionCount + 1
                : Math.min(host.sessionCount, guestRecord.sessionCount + 1);
    }

    setBranchRegistryRecord(currentRecord.id, currentRecord);
};

export const removeAllBranchBroadcastGuests = (id: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const currentRecord = getBranchRegistryRecord(id);

    const registryData = {
        ...defaultRegistryData,
        ...currentRecord,
        guests: [],
    };

    setBranchRegistryRecord(registryData.id, registryData);
};

export const removeAllBranchBroadcasts = () => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    memento.set(BRANCH_REGISTRY_KEY, {});
};
