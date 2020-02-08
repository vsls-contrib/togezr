import * as vscode from 'vscode';
import { EXTENSION_NAME_LOWERCASE } from './constants';

// export function get(key: 'togezr.githubSecret'): string;
export function get(key: any) {
    const extensionConfig = vscode.workspace.getConfiguration(
        EXTENSION_NAME_LOWERCASE
    );
    return extensionConfig.get(key);
}

export async function set(key: string, value: any) {
    const extensionConfig = vscode.workspace.getConfiguration(
        EXTENSION_NAME_LOWERCASE
    );
    return extensionConfig.update(key, value, true);
}
