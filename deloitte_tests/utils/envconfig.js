const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const baseConfigFile = '../config/base.json';
const logger = require('../utils/logger');

function getConfigFromJsonFile(jsonFilePath) {
    if (fs.existsSync(jsonFilePath)) {
        logger.info(`Read config from a json file - ${jsonFilePath}`);
        return require(path.resolve(jsonFilePath));
    } else {
        logger.debug(`File does not exist - ${jsonFilePath}`);
        return {};
    }
}

function mergeConfigs(...configs) {
    const configMerged = {};
    _.merge(configMerged, ...configs);
    return configMerged;
}

module.exports = (function () {
    // console.log(`path: ${path.join(__dirname, baseConfigFile)}`)
    const baseConfig = getConfigFromJsonFile(path.join(__dirname, baseConfigFile));
    logger.debug(`Process test env: ${process.env.testEnv}`);
    const env = process.env.testEnv ? process.env.testEnv : baseConfig.env;
    logger.debug(`Running test on test env: ${env}`);
    const envConfig = getConfigFromJsonFile(path.join(__dirname, `../config/${env}.json`));
    // The right config will overwrite the left config if they have same key
    const configMerged = mergeConfigs(baseConfig, envConfig);
    const mergedFile = path.join(__dirname, `../config/${env}-merged.json`);
    if (fs.existsSync(mergedFile)) {
        fs.rmSync(mergedFile, { force: true });
        logger.debug('Force deleting existing merged env config file');
    }
    fs.writeFileSync(mergedFile, JSON.stringify(configMerged, null, 4));

    return configMerged;
})();
