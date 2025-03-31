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

export { validateAndMergeConfig, validateFilePath }