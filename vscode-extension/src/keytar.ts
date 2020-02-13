import * as keytarType from 'keytar';
import * as vscode from 'vscode';
import { EXTENSION_NAME } from './constants';

declare const __webpack_require__: typeof require;
declare const __non_webpack_require__: typeof require;
function getNodeModule<T>(moduleName: string): T | undefined {
    const r =
        typeof __webpack_require__ === 'function'
            ? __non_webpack_require__
            : require;

    try {
        return r(`${vscode.env.appRoot}/node_modules.asar/${moduleName}`);
    } catch (err) {
        // Not in ASAR.
    }

    try {
        return r(`${vscode.env.appRoot}/node_modules/${moduleName}`);
    } catch (err) {
        // Not available.
    }
    return undefined;
}

let keytar: typeof keytarType | undefined;
export const initializeKeytar = () => {
    keytar = getNodeModule<typeof keytarType>('keytar');

    if (!keytar) {
        throw new Error('Failed to initialize keytar.');
    }
};

const GITHUB_SECRET_KEY = 'githubSecret';

const CACHE: { [key: string]: string } = Object.create(null);

export async function get(key: string): Promise<string | null>;
export async function get(
    key: typeof GITHUB_SECRET_KEY
): Promise<string | null>;
export async function get(key: any) {
    if (!keytar) {
        throw new Error('Call `initializeKeytar` first.');
    }

    const cachedKey = CACHE[key];
    if (cachedKey) {
        return cachedKey;
    }

    return await keytar.getPassword(EXTENSION_NAME, key);
}

export async function set(
    key: string,
    value: string | undefined
): Promise<void>;
export async function set(
    key: typeof GITHUB_SECRET_KEY,
    value: string
): Promise<void>;
export async function set(key: any, value: any) {
    if (!keytar) {
        throw new Error('Call `initializeKeytar` first.');
    }

    CACHE[key] = value;

    return await keytar.setPassword(EXTENSION_NAME, key, value);
}
