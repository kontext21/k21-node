use k21::capture::capture;
use k21::capture::ScreenCaptureConfig;

#[napi(object)]
pub struct JsScreenCaptureConfig {
    pub fps: Option<f64>,
    pub duration: Option<u32>,
    pub save_screenshot_to: Option<String>,
    pub save_video_to: Option<String>,
    pub video_chunk_duration: Option<u32>,
}

impl From<ScreenCaptureConfig> for JsScreenCaptureConfig {
    fn from(config: ScreenCaptureConfig) -> Self {
        Self {
            fps: config.fps.map(|f| f as f64),
            duration: config.duration.map(|d| d as u32),
            save_screenshot_to: config.save_screenshot_to,
            save_video_to: config.save_video_to,
            video_chunk_duration: config.video_chunk_duration.map(|d| d as u32),
        }
    }
}

impl From<JsScreenCaptureConfig> for ScreenCaptureConfig {
    fn from(config: JsScreenCaptureConfig) -> Self {
        Self {
            fps: config.fps.map(|f| f as f32),
            duration: config.duration.map(|d| d as u64),
            save_screenshot_to: config.save_screenshot_to,
            save_video_to: config.save_video_to,
            video_chunk_duration: config.video_chunk_duration.map(|d| d as u64),
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
