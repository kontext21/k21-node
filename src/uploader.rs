use k21::{common::ImageData, process::ProcessorConfig, upload::process_upload};

use crate::{image::JsImageDataCollection, types::JsProcessorConfig};

#[napi(object)]
pub struct JsUploaderConfig {
    pub file: String,
}

impl From<JsUploaderConfig> for String {
    fn from(config: JsUploaderConfig) -> Self {
        config.file
    }
}

impl From<String> for JsUploaderConfig {
    fn from(file: String) -> Self {
        Self { file }
    }
}

#[napi(catch_unwind)]
pub async fn process_file_upload(uploader_config: JsUploaderConfig, processor_config: JsProcessorConfig) -> napi::Result<JsImageDataCollection> {
    let file_path: String = uploader_config.into();
    let config: ProcessorConfig = processor_config.into();

    let result: Vec<ImageData> = process_upload(file_path, &config)
        .await
        .unwrap();
    
    Ok(JsImageDataCollection {
        data: result.into_iter().map(|data| data.into()).collect(),
    })
}

#[cfg(test)]
mod tests {
    use k21::{common::ProcessingType, image2text::OcrConfig};
    use super::*;

    #[tokio::test]
    async fn test_process_file_upload() {
        // Create test configurations
        let js_uploader_config = JsUploaderConfig {
            file: "/Users/ferzu/kontext21/k21-node/output-0.mp4".to_string(),
        };

        let js_processor_config = JsProcessorConfig {
            processing_type: ProcessingType::OCR.to_string(),
            ocr_config: Some(OcrConfig::default().into()),
            vision_config: None,
        };

        // Call the function
        let result = process_file_upload(js_uploader_config, js_processor_config)
            .await
            .expect("File processing should succeed");

        // Verify the result
        assert!(!result.data.is_empty(), "Should have processed at least one frame");
        
        // Check the first frame's data
        let first_frame = &result.data[0];
        assert!(first_frame.timestamp.len() > 0, "Should have a timestamp");
        assert!(first_frame.content.len() > 0, "Should have some content");

    }
}
