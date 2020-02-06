import * as vscode from 'vscode';

let memento: vscode.Memento | null = null;

export const initializeMemento = (context: vscode.ExtensionContext) => {
    memento = context.globalState;
};

export const get = <T>(key: string) => {
    if (!memento) {
        throw new Error('Initialize memento first');
    }

    return memento.get(key) as T;
};

export const set = (key: string, value: string | object) => {
    if (!memento) {
        throw new Error('Initialize memento first');
    }

    memento.update(key, value);
};

export const remove = (key: string) => {
    if (!memento) {
        throw new Error('Initialize memento first');
    }

    memento.update(key, undefined);
};
