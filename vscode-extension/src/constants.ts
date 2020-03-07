export const EXTENSION_NAME = 'Togezr';
export const EXTENSION_NAME_LOWERCASE = EXTENSION_NAME.toLowerCase();

export let extensionPath = '';

export const setExtensionPath = (path: string) => {
    extensionPath = path;
};

export const PREVENT_BRANCH_SWITCH_NOTIFICATION_MEMENTO_KEY =
    'PREVENT_BRANCH_SWITCH_NOTIFICATION_MEMENTO_KEY';

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;
