const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const baseConfigFile = '../config/base.json'


function getConfigFromJsonFile(jsonFilePath) {
    if (fs.existsSync(jsonFilePath)) {
        console.log(`Read config from a json file - ${jsonFilePath}`);
        return require(path.resolve(jsonFilePath));
    } else {
        console.log(`File does not exist - ${jsonFilePath}`);
        return {};
    }
}

function mergeConfigs(...configs) {
    let configMerged = {};
    _.merge(configMerged, ...configs);
    return configMerged;
}

module.exports = (function () {
    // console.log(`path: ${path.join(__dirname, baseConfigFile)}`)
    let baseConfig = getConfigFromJsonFile(path.join(__dirname, baseConfigFile));
    console.log(`Process test env: ${process.env.testEnv}`)
    const env = process.env.testEnv ? process.env.testEnv : baseConfig.env;
    console.log(`Running test on test env: ${env}`)
    let envConfig = getConfigFromJsonFile(path.join(__dirname, `../config/${env}.json`));
    // The right config will overwrite the left config if they have same key
    let configMerged = mergeConfigs(baseConfig, envConfig);
    let mergedFile = path.join(__dirname, `../config/${env}-merged.json`);
    if (fs.existsSync(mergedFile)) {
        fs.rmSync(mergedFile, { force: true });
        console.log('Force deleting existing merged env config file')
    }
    fs.writeFileSync(mergedFile, JSON.stringify(configMerged, null, 4));

    return configMerged;
})();
