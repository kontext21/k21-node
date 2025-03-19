use crate::capture::JsScreenCaptureConfig;
use crate::image::JsImageDataCollection;
use crate::types::JsProcessorConfig;
use k21::capture::ScreenCaptureConfig;
use k21::common::ImageData;
use k21::process::{run_live_screen_capture_ocr, ProcessorConfig};

#[napi(catch_unwind)]
pub async fn capture_and_process_screen(
    js_capture_config: JsScreenCaptureConfig,
    js_processor_config: JsProcessorConfig,
) -> napi::Result<JsImageDataCollection> {
    let capture_config: ScreenCaptureConfig = js_capture_config.into();
    let processor_config: ProcessorConfig = js_processor_config.into();

    let result: Vec<ImageData> = run_live_screen_capture_ocr(&capture_config, &processor_config)
        .await
        .into();

    Ok(JsImageDataCollection {
        data: result.into_iter().map(|data| data.into()).collect(),
    })
}
