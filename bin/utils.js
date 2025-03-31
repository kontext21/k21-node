"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndMergeConfig = validateAndMergeConfig;
exports.validateFilePath = validateFilePath;
function validateAndMergeConfig(defaultConfig, newConfig) {
    if (newConfig === undefined) {
        newConfig = {};
    }
    return {
        ...defaultConfig,
        ...newConfig
    };
}
function validateFilePath(file) {
    if (!file) {
        throw new Error('Uploader file is required');
    }
    // Check if file path exists and is a file
    try {
        const fs = require('fs');
        const stats = fs.statSync(file);
        if (!stats.isFile()) {
            throw new Error('Provided path is not a file');
        }
    }
    catch (error) {
        throw new Error(`Invalid file path: ${file}`);
    }
}
