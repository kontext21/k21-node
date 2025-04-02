import { CaptureConfig, ProcessedFrameData, ProcessorConfig, CaptureFromFileConfig } from './types';
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
     * - duration: 10
     * - saveVideoTo: ''
     * - saveScreenshotTo: ''
     * - videoChunkDuration: 60
     * @throws Error if file capturer is already set
     * @example
     * k21.setCapturer({
     *   fps: 1,
     *   duration: 10,
     *   saveVideoTo: './',
     *   saveScreenshotTo: './',
     *   videoChunkDuration: 60
     * });
     */
    setCapturer(captureConfig?: CaptureConfig): void;
    /**
     * Sets the configuration for capturing from a file
     * @param capturerFromFile - Configuration for processing files. Must include:
     * - file: Valid path to the file to be processed (.mp4 or .png)
     * @throws Error if file path is invalid
     * @throws Error if screen capturer is already set
     */
    setCapturerFromFile(capturerFromFile: CaptureFromFileConfig): void;
    /**
     * Sets the processor configuration for image processing
     * @param processor - Optional processor configuration. If not provided, default values will be used:
     * - processingType: 'OCR'
     * - ocrConfig:
     *   - ocrModel: 'default'
     *   - boundingBoxes: true
     * @example
     * k21.setProcessor({
     *   processingType: "OCR",
     *   ocrConfig: {
     *     ocrModel: "default",
     *     boundingBoxes: true
     *   }
     * });
     */
    setProcessor(processorConfig?: ProcessorConfig): void;
    /**
     * Executes the screen capture and processing pipeline
     * @returns Promise<ProcessedFrameData[]> Array of processed frames with their metadata:
     * - timestamp: ISO timestamp of capture
     * - frameNumber: Sequential frame number
     * - content: Processed content (e.g., OCR text)
     * - processingType: Type of processing applied
     * @throws Error if neither screen capturer nor file capturer is set
     * @throws Error if screen capture or processing fails
     * @example
     * // Capture and process frames
     * const frames = await k21.run();
     * // Returns array of ProcessedFrameData objects, or empty array if no processor is set
     */
    run(): Promise<ProcessedFrameData[]>;
    private handleUploadAndProcess;
    private validateRunPrerequisites;
    private handleCaptureOnly;
    private handleCaptureAndProcess;
}
export { K21 };
