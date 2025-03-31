use k21::{common::{ImageData, ImageDataCollection}, process::ProcessorConfig, upload::process_upload};

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
    
    println!("result: {:?}", result);

    Ok(JsImageDataCollection {
        data: result.into_iter().map(|data| data.into()).collect(),
    })
}
