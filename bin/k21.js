"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.K21Pipeline = void 0;
const k21_internal_1 = __importDefault(require("./k21_internal"));
class K21Pipeline {
    capturer;
    uploader;
    processor;
    defaultCaptureConfig = {
        fps: 1,
        recordLengthInSeconds: 10,
        saveVideo: false,
        outputDirVideo: '',
        videoChunkDurationInSeconds: 60,
        saveScreenshot: false,
        outputDirScreenshot: '',
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
        if (captureConfig === undefined) {
            captureConfig = {};
        }
        const finalCaptureConfig = {
            ...this.defaultCaptureConfig,
            ...captureConfig
        };
        this.capturer = finalCaptureConfig;
    }
    setUploader(uploader) {
        if (this.capturer !== null) {
            throw new Error('Cannot set Uploader when Capturer is already set');
        }
        if (uploader === undefined) {
            uploader = {};
        }
        this.uploader = uploader;
    }
    /**
     * Sets the processor configuration for image processing
     * @param processor - Configuration for processing captured images. If undefined, empty config will be used
     * @example
     * // Basic OCR processing
     * pipeline.setProcessor({
     *   processingType: "OCR",
     * });
     *
     * // OCR processing
     * pipeline.setProcessor({
     *   processingType: "OCR",
     *   ocrConfig: {
     *     ocrModel: "native",
     *     boundingBoxes: true
     *   }
     * });
     */
    setProcessor(processorConfig) {
        if (processorConfig === undefined) {
            processorConfig = {};
        }
        const finalProcessorConfig = {
            ...this.defaultProcessorConfig,
            ...processorConfig
        };
        this.processor = finalProcessorConfig;
    }
    /**
     * Executes the screen capture and processing pipeline
     * @returns Promise<ImageData[]> Array of processed images with their metadata. Empty array if no processor is set.
     * Each ImageData contains:
      * - processingType: Type of processing applied
     * @throws Error if neither capturer nor uploader is set
     * @throws Error if screen capture or processing fails
     */
    async run() {
        if (!this.capturer && !this.uploader) {
            throw new Error('Either Capturer or Uploader must be set');
        }
        if (this.capturer && !this.processor) {
            try {
                await k21_internal_1.default.captureScreen(this.capturer);
                return [];
            }
            catch (error) {
                throw new Error(`Screen capture failed: ${error?.message}`);
            }
        }
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
exports.K21Pipeline = K21Pipeline;
