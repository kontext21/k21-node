declare function validateAndMergeConfig<T>(defaultConfig: T, newConfig?: T): T;
declare function validateFilePath(file: string): void;
declare function validatePath(path: string): void;
export { validateAndMergeConfig, validateFilePath, validatePath };
