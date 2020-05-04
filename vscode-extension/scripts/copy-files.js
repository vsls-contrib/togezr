const path = require('path');
const fs = require('fs-extra');

const outDir = path.resolve(__dirname, '../out/prod');
const releaseDir = path.resolve(outDir, './out/prod');

const typesDir = path.resolve(__dirname, '../out/types');
const typesReleaseDir = path.resolve(outDir, './out/types');

const rootDir = path.resolve(__dirname, '../');
// const srcDir = path.resolve(__dirname, '../src');
const srcReleaseDir = path.resolve(outDir, './src');

const imageDir = path.resolve(__dirname, '../images');
const imageReleaseDir = path.resolve(outDir, './images');

// const interfacesDir = path.resolve(__dirname, '../src/interfaces');
// const interfacesReleaseDir = path.resolve(outDir, './src/interfaces');

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const copyFileSync = (fileName, src, dest) => {
    const data = fs.readFileSync(path.join(src, fileName));

    fs.writeFileSync(path.join(dest, fileName), data);
};

ensureDir(releaseDir);
ensureDir(srcReleaseDir);
ensureDir(imageReleaseDir);
ensureDir(typesReleaseDir);
// ensureDir(interfacesReleaseDir);

const extensionFileName = 'extension.js';
const extensionFileMapName = 'extension.js.map';

copyFileSync(extensionFileName, outDir, releaseDir);
copyFileSync(extensionFileMapName, outDir, releaseDir);
copyFileSync('package.json', rootDir, outDir);
copyFileSync('LICENSE.md', rootDir, outDir);

const ignoreFiles = [extensionFileName, extensionFileMapName];

fs.writeFileSync(
    path.join(outDir, './.npmignore'),
    ignoreFiles.map((e) => `/${e}`).join('\n')
);

fs.writeFileSync(path.join(outDir, './.vscodeignore'), ignoreFiles.join('\n'));

fs.copySync(imageDir, imageReleaseDir);
fs.copySync(typesDir, typesReleaseDir);
