use crate::capture::JsScreenCaptureConfig;
use crate::image::JsImageDataCollection;
use crate::types::JsProcessorConfig;
use k21::capture::ScreenCaptureConfig;
use k21::common::ImageDataCollection;
use k21::process::ProcessorConfig;

#[napi(catch_unwind)]
pub async fn capture_and_process_screen(
    js_capture_config: JsScreenCaptureConfig,
    js_processor_config: JsProcessorConfig,
) -> napi::Result<JsImageDataCollection> {

    let capture_config: ScreenCaptureConfig = js_capture_config.into();
    let processor_config: ProcessorConfig = js_processor_config.into();

    let result: ImageDataCollection = k21::process::capture_and_process_screen(&capture_config, &processor_config)
        .await;
    
    Ok(result.into())
}

#[cfg(test)]
mod tests {
    use k21::{common::ProcessingType, image2text::OcrConfig};
    use super::*;

    #[tokio::test]
    async fn test_capture_and_process_screen() {
        // Create test configurations
        let js_capture_config = JsScreenCaptureConfig {
            fps: Some(1.0),
            duration: Some(3),
            save_screenshot_to: Some("./".to_string()),
            save_video_to: Some("./".to_string()),
            video_chunk_duration: Some(10),
            quality: Some(100),
        };

        let js_processor_config = JsProcessorConfig {
            processing_type: ProcessingType::OCR.to_string(),
            ocr_config: Some(OcrConfig::default().into()),
            vision_config: None,
        };

        // Call the function
        let result = capture_and_process_screen(js_capture_config, js_processor_config)
            .await
            .expect("Screen capture should succeed");

        // Verify the result
        assert!(!result.data.is_empty(), "Should have captured at least one frame");
        
        // Check the first frame's data
        let first_frame = &result.data[0];
        assert!(first_frame.timestamp.len() > 0, "Should have a timestamp");
        assert!(first_frame.frame_number > 0, "Should have a valid frame number");
        assert!(first_frame.content.len() > 0, "Should have some content");
    }
}
