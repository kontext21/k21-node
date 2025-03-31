import { CaptureConfig, ImageData, ProcessorConfig, UploaderConfig } from './types';
declare class K21 {
    private capturer;
    private uploader;
    private processor;
    private defaultCaptureConfig;
    private defaultProcessorConfig;
    constructor();
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
    setCapturer(captureConfig?: CaptureConfig): void;
    /**
     * Sets the uploader configuration
     * @param uploader - Configuration for uploading files. Must include:
     * - file: Valid path to the file to be processed
     * @throws Error if uploader file path is invalid
     * @throws Error if Capturer is already set
     */
    setUploader(uploader: UploaderConfig): void;
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
    setProcessor(processorConfig?: ProcessorConfig): void;
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
    run(): Promise<ImageData[]>;
    private handleUploadAndProcess;
    private validateRunPrerequisites;
    private handleCaptureOnly;
    private handleCaptureAndProcess;
}
export { K21 };
