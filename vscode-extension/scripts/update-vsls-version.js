const fs = require('fs');
const path = require('path');

const VSLS_PACKAGE_JSON_VERSION = '0.3.99';
const PACKAGE_JSON_PATH = path.join(
    __dirname,
    '../node_modules/vsls/package.json'
);

const packageJSON = require(PACKAGE_JSON_PATH);

if (!packageJSON) {
    throw new Error('Cannot find vsls package.json');
}

packageJSON.version = VSLS_PACKAGE_JSON_VERSION;

fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJSON, null, 4));

console.log(
    `vsls package.json updated to version ${VSLS_PACKAGE_JSON_VERSION}`
);
