import * as vsls from 'vsls';
import * as memento from '../../memento';
import { IChannelRegistryData } from './channelsRegistry';

export interface IGuestWithSessions {
    sessionCount: number;
    data: vsls.UserInfo;
}

export interface IRegistryData {
    isRunning: boolean;
    isExplicitellyStopped: boolean;
    sessionId?: string;
    githubIssue: string;
    channel: IChannelRegistryData;
    repoId: string;
    branchName: string;
    guests: IGuestWithSessions[];
}

const defaultRegistryData: IRegistryData = {
    isRunning: false,
    isExplicitellyStopped: false,
    githubIssue: '',
    channel: {
        name: '',
        url: '',
    },
    repoId: '',
    branchName: '',
    guests: [],
};

interface IRegistryRecords {
    [key: string]: IRegistryData;
}

const BRANCH_REGISTRY_KEY = 'togezr.broadcast.branches.registry';

const BRANCH_REGISTRY_PREFIX = 'togezr.branch.registry.';

const getBranchRecordName = (repoId: string, branchName: string) => {
    return `${BRANCH_REGISTRY_PREFIX}${repoId}.${branchName}`;
};

export interface IBranchRegistrationOptions {
    repoId: string;
    branchName: string;
    githubIssue: string;
    channel: IChannelRegistryData;
}

export const setLiveshareSessionForBranchRegitryRecord = (
    repoId: string,
    branchName: string,
    sessionId: string
) => {
    const record = getBranchRegistryRecord(repoId, branchName);

    if (!record) {
        return;
    }

    setBranchRegistryRecord(record.repoId, branchName, {
        ...record,
        sessionId,
    });
};

const getRegistryRecords = (): IRegistryRecords => {
    const data = memento.get<IRegistryRecords | undefined>(BRANCH_REGISTRY_KEY);

    return data || {};
};

export const getBranchRegistryRecord = (
    repoId: string,
    branchName: string
): IRegistryData | undefined => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryRecords = getRegistryRecords();

    const registryData =
        registryRecords[getBranchRecordName(repoId, branchName)];

    if (!registryData) {
        return;
    }

    return {
        ...defaultRegistryData,
        ...registryData,
    };
};

export const setBranchRegistryRecord = (
    repoId: string,
    branchName: string,
    data: IRegistryData
): void => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryRecords = getRegistryRecords();

    registryRecords[getBranchRecordName(repoId, branchName)] = data;
    memento.set(BRANCH_REGISTRY_KEY, registryRecords);
};

export const registerBranch = async (options: IBranchRegistrationOptions) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }
    const { branchName, githubIssue, channel, repoId } = options;

    const registryData = getBranchRegistryRecord(repoId, branchName);

    const data: IRegistryData = {
        ...defaultRegistryData,
        ...registryData,
        repoId,
        branchName,
        githubIssue,
        channel,
    };

    setBranchRegistryRecord(data.repoId, branchName, data);
};

export const unregisterBranch = async (repoId: string, branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const data = getRegistryRecords();

    delete data[getBranchRecordName(repoId, branchName)];

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

    const registryData = getBranchRegistryRecord(repoId, branchName);

    return !!registryData;
};

export const setBranchRunning = (repoId: string, branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(repoId, branchName),
        isRunning: true,
    };

    setBranchRegistryRecord(registryData.repoId, branchName, registryData);
};

export const setBranchStopped = (repoId: string, branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(repoId, branchName),
        isRunning: false,
    };

    setBranchRegistryRecord(registryData.repoId, branchName, registryData);
};

export const setBranchExplicitelyStopped = (
    repoId: string,
    branchName: string
) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(repoId, branchName),
        isExplicitellyStopped: true,
    };

    setBranchRegistryRecord(registryData.repoId, branchName, registryData);
};

export const resetBranchExplicitelyStopped = (
    repoId: string,
    branchName: string
) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(repoId, branchName),
        isExplicitellyStopped: false,
    };

    setBranchRegistryRecord(registryData.repoId, branchName, registryData);
};

export const isBranchExplicitellyStopped = (
    repoId: string,
    branchName: string
) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = getBranchRegistryRecord(repoId, branchName);

    return !!(registryData && registryData.isExplicitellyStopped);
};

export const addBranchBroadcastGuest = (
    repoId: string,
    branchName: string,
    guest: vsls.UserInfo
) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const currentRecord = getBranchRegistryRecord(repoId, branchName);

    const registryData = {
        ...defaultRegistryData,
        ...currentRecord,
    };

    if (!currentRecord) {
        const data = {
            ...registryData,
            guests: [{ sessionCount: 1, data: guest }],
        };

        return setBranchRegistryRecord(registryData.repoId, branchName, data);
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

    setBranchRegistryRecord(
        currentRecord.repoId,
        currentRecord.branchName,
        currentRecord
    );
};

export const removeAllBranchBroadcastGuests = (
    repoId: string,
    branchName: string
) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const currentRecord = getBranchRegistryRecord(repoId, branchName);

    const registryData = {
        ...defaultRegistryData,
        ...currentRecord,
        guests: [],
    };

    setBranchRegistryRecord(
        registryData.repoId,
        registryData.branchName,
        registryData
    );
};
