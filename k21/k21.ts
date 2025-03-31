import k21 from './k21_internal'
import { CaptureConfig, ProcessorConfig, UploaderConfig } from './types';
import { validateFilePath, validateAndMergeConfig } from './utils';

class K21 {
    private capturer: any;
    private uploader: any;
    private processor: any;
    private defaultCaptureConfig: CaptureConfig = {
        fps: 1,
        duration: 10,
    };
    private defaultProcessorConfig: ProcessorConfig = {
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
    setCapturer(captureConfig?: CaptureConfig): void {
        if (this.uploader !== null) {
            throw new Error('Cannot set Capturer when Uploader is already set');
        }
        this.capturer = validateAndMergeConfig(this.defaultCaptureConfig, captureConfig);
    }

    /**
     * Sets the uploader configuration
     * @param uploader - Configuration for uploading files. Must include:
     * - file: Valid path to the file to be processed
     * @throws Error if uploader file path is invalid
     * @throws Error if Capturer is already set
     */
    setUploader(uploader: UploaderConfig): void {
        if (this.capturer !== null) {
            throw new Error('Cannot set Uploader when Capturer is already set')
        }

        if (uploader.file === undefined) {
            throw new Error('Uploader file is required');
        }

        if (!uploader.file.match(/\.(mp4|png)$/i)) {
            throw new Error('File must be either .mp4 or .png');
        }

        validateFilePath(uploader.file);
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
    setProcessor(processorConfig?: ProcessorConfig): void {
        this.processor = validateAndMergeConfig(this.defaultProcessorConfig, processorConfig);
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
    async run(): Promise<ImageData[]> {
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

    private async  handleUploadAndProcess(): Promise<ImageData[]> {
        return await k21.processFileUpload(this.uploader, this.processor);
    }

    private validateRunPrerequisites(): void {
        const hasCapturer = this.capturer !== null;
        const hasUploader = this.uploader !== null;
        const hasProcessor = this.processor !== null;

        // Case: Only Capturer (valid)
        // Case: Capturer + Processor (valid)
        // Case: Uploader + Processor (valid)
        const isValidCombination = 
            hasCapturer || 
            (hasCapturer && hasProcessor) || 
            (hasUploader && hasProcessor);

        if (!isValidCombination) {
            throw new Error(
                'Invalid configuration. Must have either: ' +
                '1) Capturer only, ' +
                '2) Capturer with Processor, or ' +
                '3) Uploader with Processor'
            );
        }

        // Prevent having both Capturer and Uploader
        if (hasCapturer && hasUploader) {
            throw new Error('Cannot have both Capturer and Uploader set');
        }
    }

    private async handleCaptureOnly(): Promise<ImageData[]> {
        try {
            await k21.captureScreen(this.capturer);
            return [];
        } catch (error: any) {
            throw new Error(`Screen capture failed: ${error?.message}`);
        }
    }

    private async handleCaptureAndProcess(): Promise<ImageData[]> {
        try {
            console.log('Running routine with:', {
                capturer: this.capturer,
                uploader: this.uploader,
                processor: this.processor,
            });
            const result = await k21.captureAndProcessScreen(this.capturer, this.processor);
            return result.data;
        } catch (error: any) {
            throw new Error(`Routine failed: ${error?.message}`);
        }
    }
}

// Export default instance
export { K21 }
