import { CaptureConfig, ProcessorConfig } from "./types";

function isInvalidKey(key: string, validKeys: readonly string[]): boolean {
    return !validKeys.includes(key);
}

function validateAndMergeConfig<T extends object>(defaultConfig: T, configKeys: readonly string[], newConfig?: T): T {
    if (newConfig === undefined) {
        newConfig = {} as T;
    }

    // Check for unknown fields early
    for (const key of Object.keys(newConfig)) {
        if (isInvalidKey(key, configKeys)) {
            throw new Error(`Unknown configuration field: "${key}". Valid fields are: ${configKeys.join(', ')}`);
        }
    }

    const merged = { ...defaultConfig };

    for (const [key, value] of Object.entries(newConfig)) {
        if (!isInvalidKey(key, configKeys)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                // If the property is an object (and not an array), recursively merge
                merged[key as keyof T] = validateAndMergeConfig(
                    defaultConfig[key as keyof T] as object,
                    Object.keys(defaultConfig[key as keyof T] as object) as readonly string[],
                    value as object
                ) as T[keyof T];
            } else {
                // For non-object values, simply override
                merged[key as keyof T] = value as T[keyof T];
            }
        }
    }

    return merged;
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