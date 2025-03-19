use k21::capture::capture;
use k21::capture::ScreenCaptureConfig;

#[napi(object)]
pub struct JsScreenCaptureConfig {
    pub fps: f64,
    pub video_chunk_duration_in_seconds: u32,
    pub save_screenshot: bool,
    pub save_video: bool,
    pub record_length_in_seconds: u32,
    pub output_dir_video: Option<String>,
    pub output_dir_screenshot: Option<String>,
}

impl From<ScreenCaptureConfig> for JsScreenCaptureConfig {
    fn from(config: ScreenCaptureConfig) -> Self {
        Self {
            fps: config.fps as f64,
            video_chunk_duration_in_seconds: config.video_chunk_duration_in_seconds as u32,
            save_screenshot: config.save_screenshot,
            save_video: config.save_video,
            record_length_in_seconds: config.record_length_in_seconds as u32,
            output_dir_video: config.output_dir_video,
            output_dir_screenshot: config.output_dir_screenshot,
        }
    }
}

impl From<JsScreenCaptureConfig> for ScreenCaptureConfig {
    fn from(config: JsScreenCaptureConfig) -> Self {
        Self {
            fps: config.fps as f32,
            video_chunk_duration_in_seconds: config.video_chunk_duration_in_seconds as u64,
            save_screenshot: config.save_screenshot,
            save_video: config.save_video,
            record_length_in_seconds: config.record_length_in_seconds as u64,
            output_dir_video: config.output_dir_video,
            output_dir_screenshot: config.output_dir_screenshot,
        }
    }
}

#[napi(catch_unwind)]
pub async fn capture_screen(config: JsScreenCaptureConfig) -> napi::Result<()> {
    let native_config: ScreenCaptureConfig = config.into();
    capture(native_config)
        .await
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(())
}
