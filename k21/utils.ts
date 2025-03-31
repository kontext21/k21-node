import { ProcessorConfig } from "./types";

function validateAndMergeConfig<T>(defaultConfig: T, newConfig?: T): T {
    if (newConfig === undefined) {
        newConfig = {} as T;
    }

    return {
        ...defaultConfig,
        ...newConfig
    };
}

function validateFilePath(file: string): void {
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
    } catch (error) {
        throw new Error(`Invalid file path: ${file}`);
    }
}

 function validatePath(path: string): void {
    if (!path) {
        throw new Error('Path is required');
    }

    // Check if path exists
    try {
        const fs = require('fs');
        if (!fs.existsSync(path)) {
            throw new Error(`Path does not exist: ${path}`);
        }
        
        const stats = fs.statSync(path);
        if (stats.isFile()) {  // Changed condition: throw if it IS a file
            throw new Error(`Path points to a file, but should be a directory: ${path}`);
        }
    } catch (error) {
        throw new Error(`Invalid path: ${path}`);
    }
}

export { validateAndMergeConfig, validateFilePath, validatePath }