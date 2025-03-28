/**
 * Configuration options for screen capture
 * Controls capture parameters, file saving behavior,
 * and output locations for video and screenshots
 * @example
 * // Basic capture without saving
 * const config: CaptureConfig = {
 *   fps: 1,
 *   recordLengthInSeconds: 60
 * }
 *
 * // Capture with video saving
 * const config: CaptureConfig = {
 *   fps: 1,
 *   recordLengthInSeconds: 60,
 *   saveVideo: true,
 *   outputDirVideo: '/path/to/videos',
 *   videoChunkDurationInSeconds: 60
 * }
 */
interface CaptureConfig {
    /** Frames per second for capture. Default: 1 */
    fps?: number;
    /** Total duration of capture in seconds. Default: 10 */
    duration?: number;
    /** Whether to save screenshots during capture. Default: false */
    saveScreenshot?: boolean;
    /** Whether to save video during capture. Default: false */
    saveVideo?: boolean;
    /** Duration of each video chunk in seconds. Required if saveVideo is true. Default: 60 */
    videoChunkDurationInSeconds?: number;
}
/** Configuration for vision-based processing using external vision APIs */
interface VisionConfig {
    /** Base URL for the vision API endpoint */
    url?: string;
    /** Authentication key for the vision API */
    apiKey?: string;
    /** Model identifier to use for vision processing */
    model?: string;
    /** Optional prompt to guide the vision model's analysis */
    prompt?: string;
}
/** Configuration for Optical Character Recognition (OCR) processing */
interface OcrConfig {
    /** OCR model to use (e.g., "tesseract", "native", "default") */
    ocrModel?: string;
    /** Whether to include text bounding box coordinates in results */
    boundingBoxes?: boolean;
    /** Dots per inch for image processing. Higher values for smaller text */
    dpi?: number;
    /** Page Segmentation Mode (PSM) - controls how the page is analyzed */
    psm?: number;
    /** OCR Engine Mode (OEM) - controls which engine(s) are used */
    oem?: number;
}
/** Main configuration for image processing pipeline */
interface ProcessorConfig {
    /** Type of processing to apply ("OCR", "Vision") */
    processingType?: string;
    /** Configuration for OCR-based processing */
    ocrConfig?: OcrConfig;
    /** Configuration for vision-based processing */
    visionConfig?: VisionConfig;
}
/**
 * Represents a processed frame from the screen capture
 * Contains metadata about the capture time, frame sequence,
 * and the results of processing (like OCR text)
 */
interface ImageData {
    /** ISO timestamp when the frame was captured */
    timestamp: string;
    /** Sequential number of the frame in the capture sequence */
    frameNumber: number;
    /** Processed content from the frame (e.g., OCR text) */
    content: string;
    /** Type of processing applied to the frame (e.g., "OCR", "CLASSIFICATION") */
    processingType: string;
}
declare class K21Pipeline {
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
    setUploader(uploader: any): void;
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
    setProcessor(processorConfig?: ProcessorConfig): void;
    /**
     * Executes the screen capture and processing pipeline
     * @returns Promise<ImageData[]> Array of processed images with their metadata. Empty array if no processor is set.
     * Each ImageData contains:
      * - processingType: Type of processing applied
     * @throws Error if neither capturer nor uploader is set
     * @throws Error if screen capture or processing fails
     */
    run(): Promise<ImageData[]>;
}
export { K21Pipeline, ImageData, CaptureConfig };
