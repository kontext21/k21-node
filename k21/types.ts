
/** Configuration options for screen capture */
interface CaptureConfig {
    /** Frames per second for capture. Default: 1 */
    fps?: number;
    /** Total duration of capture in seconds. Default: 10 */
    duration?: number;
    /** Path where screenshots should be saved. If not provided, screenshots won't be saved */
    saveScreenshotTo?: string;
    /** Path where video should be saved. If not provided, video won't be saved */
    saveVideoTo?: string;
    /** Duration of each video chunk in seconds. Default: 60 */
    videoChunkDuration?: number;
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

interface CaptureFromFileConfig {
    /** Base URL for the uploader API endpoint */
    file: string;
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
interface ProcessedFrameData {
    /** ISO timestamp when the frame was captured */
    timestamp: string;
    /** Sequential number of the frame in the capture sequence */
    frameNumber: number;
    /** Processed content from the frame (e.g., OCR text) */
    content: string;
    /** Type of processing applied to the frame (e.g., "OCR", "CLASSIFICATION") */
    processingType: string;
}

export { CaptureConfig, CaptureFromFileConfig, ProcessorConfig, ProcessedFrameData }