import * as memento from '../../memento';
import { IChannelRegistryData } from './channelsRegistry';

export interface IRegistryData {
    isRunning: boolean;
    isExplicitellyStopped: boolean;
    sessionId?: string;
    githubIssue: string;
    channel: IChannelRegistryData;
}

const defaultRegistryData: IRegistryData = {
    isRunning: false,
    isExplicitellyStopped: false,
    githubIssue: '',
    channel: {
        name: '',
        url: '',
    },
};

export interface IBranchRegistrationOptions {
    branchName: string;
    githubIssue: string;
    channel: IChannelRegistryData;
}

export const setLiveshareSessionForBranchRegitryRecord = (
    branchName: string,
    sessionId: string
) => {
    const record = getBranchRegistryRecord(branchName);

    if (!record) {
        return;
    }

    record.sessionId = sessionId;

    memento.set(getBranchRecordName(branchName), record);
};

// const BRANCH_REGISTRY_KEY = 'livehsare.branch.registry.known.branches';
// const getKnownBranches = () => {
// }

// const setKnownBranches = () => {
// }

export const getBranchRegistryRecord = (
    branchName: string
): IRegistryData | undefined => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = memento.get<IRegistryData | undefined>(
        getBranchRecordName(branchName)
    );

    if (!registryData) {
        return undefined;
    }

    return {
        ...defaultRegistryData,
        ...registryData,
    };
};

const BRANCH_REGISTRY_PREFIX = 'livehsare.branch.registry.';

const getBranchRecordName = (branchName: string) => {
    return `${BRANCH_REGISTRY_PREFIX}${branchName}`;
};
export const registerBranch = async (options: IBranchRegistrationOptions) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }
    const { branchName, githubIssue, channel } = options;

    const registryData = getBranchRegistryRecord(branchName);

    if (registryData) {
        return;
    }

    const data: IRegistryData = {
        ...defaultRegistryData,
        githubIssue,
        channel,
    };

    memento.set(getBranchRecordName(branchName), data);
};

export const unregisterBranch = async (branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    memento.remove(getBranchRecordName(branchName));
};

export const isBranchAlreadyRegistered = (branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = getBranchRegistryRecord(branchName);

    return !!registryData;
};

export const setBranchRunning = (branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(branchName),
        isRunning: true,
    };

    memento.set(getBranchRecordName(branchName), registryData);
};

export const setBranchStopped = (branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(branchName),
        isRunning: false,
    };

    memento.set(getBranchRecordName(branchName), registryData);
};

export const setBranchExplicitelyStopped = (branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(branchName),
        isExplicitellyStopped: true,
    };

    memento.set(getBranchRecordName(branchName), registryData);
};

export const resetBranchExplicitelyStopped = (branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = {
        ...defaultRegistryData,
        ...getBranchRegistryRecord(branchName),
        isExplicitellyStopped: false,
    };

    memento.set(getBranchRecordName(branchName), registryData);
};

export const isBranchExplicitellyStopped = (branchName: string) => {
    if (!memento) {
        throw new Error(
            'The memento storage is not initialized. Please call `initializeBranchRegistry()` first.'
        );
    }

    const registryData = getBranchRegistryRecord(branchName);

    return !!(registryData && registryData.isExplicitellyStopped);
};
