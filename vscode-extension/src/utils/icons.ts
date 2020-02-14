import * as path from 'path';
import { extensionPath } from '../constants';

const ICONS_FOLDER_NAME = 'images';

export const getDarkIconPath = (iconName: string) => {
    if (!extensionPath) {
        throw new Error('No extensionPath set.');
    }

    return path.join(extensionPath, `${ICONS_FOLDER_NAME}/dark/${iconName}`);
};

export const getLightIconPath = (iconName: string) => {
    if (!extensionPath) {
        throw new Error('No extensionPath set.');
    }

    return path.join(extensionPath, `${ICONS_FOLDER_NAME}/light/${iconName}`);
};

export const getIconPack = (iconName: string) => {
    return {
        dark: getDarkIconPath(iconName),
        light: getLightIconPath(iconName),
    };
};
