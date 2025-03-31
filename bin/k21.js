"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.K21 = void 0;
const k21_internal_1 = __importDefault(require("./k21_internal"));
const utils_1 = require("./utils");
class K21 {
    capturer;
    uploader;
    processor;
    defaultCaptureConfig = {
        fps: 1,
        duration: 10,
    };
    defaultProcessorConfig = {
        processingType: 'OCR',
        ocrConfig: {
            ocrModel: 'default',
            boundingBoxes: true,
        },
    };
    constructor() {
        this.capturer = null;
        this.uploader = null;
        this.processor = null;
    }
    /**
     * Sets the screen capture configuration
     * @param config - Optional capture configuration. If not provided, default values will be used:
     * - fps: 1
     * - recordLengthInSeconds: 10
     * - saveVideo: false
     * - outputDirVideo: ''
     * - videoChunkDurationInSeconds: 60
     * - saveScreenshot: false
     * - outputDirScreenshot: ''
     * @throws Error if uploader is already set
     */
    setCapturer(captureConfig) {
        if (this.uploader !== null) {
            throw new Error('Cannot set Capturer when Uploader is already set');
        }
        this.capturer = (0, utils_1.validateAndMergeConfig)(this.defaultCaptureConfig, captureConfig);
    }
    /**
     * Sets the uploader configuration
     * @param uploader - Configuration for uploading files. Must include:
     * - file: Valid path to the file to be processed
     * @throws Error if uploader file path is invalid
     * @throws Error if Capturer is already set
     */
    setUploader(uploader) {
        if (this.capturer !== null) {
            throw new Error('Cannot set Uploader when Capturer is already set');
        }
        if (uploader.file === undefined) {
            throw new Error('Uploader file is required');
        }
        if (!uploader.file.match(/\.(mp4|png)$/i)) {
            throw new Error('File must be either .mp4 or .png');
        }
        (0, utils_1.validateFilePath)(uploader.file);
        this.uploader = uploader;
    }
    /**
     * Sets the processor configuration for image processing
     * @param processor - Optional processor configuration. If not provided, default values will be used:
     * - processingType: 'OCR'
     * - ocrConfig:
     *   - ocrModel: 'default'
     *   - boundingBoxes: true
     * @example
     * // Basic OCR processing
     * pipeline.setProcessor({
     *   processingType: "OCR",
     * });
     */
    setProcessor(processorConfig) {
        this.processor = (0, utils_1.validateAndMergeConfig)(this.defaultProcessorConfig, processorConfig);
    }
    /**
     * Executes the screen capture and processing pipeline
     * @returns Promise<ImageData[]> Array of processed images with their metadata:
     * - timestamp: ISO timestamp of capture
     * - frameNumber: Sequential frame number
     * - content: Processed content (e.g., OCR text)
     * - processingType: Type of processing applied
     * @throws Error if neither capturer nor uploader is set
     * @throws Error if screen capture or processing fails
     * @example
     * const results = await pipeline.run();
     * // Returns empty array if no processor is set
     */
    async run() {
        this.validateRunPrerequisites();
        const hasCapturer = this.capturer !== null;
        const hasUploader = this.uploader !== null;
        const hasProcessor = this.processor !== null;
        // Case 1: Capturer only
        if (hasCapturer && !hasProcessor) {
            return this.handleCaptureOnly();
        }
        // Case 2: Capturer + Processor
        if (hasCapturer && hasProcessor) {
            return this.handleCaptureAndProcess();
        }
        // Case 3: Uploader + Processor
        if (hasUploader && hasProcessor) {
            return this.handleUploadAndProcess();
        }
        // This should never happen due to validateRunPrerequisites
        throw new Error('Invalid configuration state');
    }
    async handleUploadAndProcess() {
        console.log('Uploader:', this.uploader);
        const file = this.uploader.file;
        console.log('Processing file:', file);
        return await k21_internal_1.default.processFileUpload(file, this.processor);
    }
    validateRunPrerequisites() {
        const hasCapturer = this.capturer !== null;
        const hasUploader = this.uploader !== null;
        const hasProcessor = this.processor !== null;
        // Case: Only Capturer (valid)
        // Case: Capturer + Processor (valid)
        // Case: Uploader + Processor (valid)
        const isValidCombination = hasCapturer ||
            (hasCapturer && hasProcessor) ||
            (hasUploader && hasProcessor);
        if (!isValidCombination) {
            throw new Error('Invalid configuration. Must have either: ' +
                '1) Capturer only, ' +
                '2) Capturer with Processor, or ' +
                '3) Uploader with Processor');
        }
        // Prevent having both Capturer and Uploader
        if (hasCapturer && hasUploader) {
            throw new Error('Cannot have both Capturer and Uploader set');
        }
    }
    async handleCaptureOnly() {
        try {
            await k21_internal_1.default.captureScreen(this.capturer);
            return [];
        }
        catch (error) {
            throw new Error(`Screen capture failed: ${error?.message}`);
        }
    }
    async handleCaptureAndProcess() {
        try {
            console.log('Running routine with:', {
                capturer: this.capturer,
                uploader: this.uploader,
                processor: this.processor,
            });
            const result = await k21_internal_1.default.captureAndProcessScreen(this.capturer, this.processor);
            return result.data;
        }
        catch (error) {
            throw new Error(`Routine failed: ${error?.message}`);
        }
    }
}
exports.K21 = K21;
