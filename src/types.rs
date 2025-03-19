use k21::{
    image2text::{OcrConfig, VisionConfig},
    process::ProcessorConfig,
};

#[napi(object)]
pub struct JsProcessorConfig {
    pub processing_type: String,
    pub vision_config: Option<JsVisionConfig>,
    pub ocr_config: Option<JsOcrConfig>,
}

#[napi(object)]
pub struct JsVisionConfig {
    pub url: Option<String>,
    pub api_key: Option<String>,
    pub model: Option<String>,
    pub prompt: Option<String>,
}

#[napi(object)]
pub struct JsOcrConfig {
    pub ocr_model: String,
    pub bounding_boxes: Option<bool>,
    pub dpi: Option<u32>,
    pub psm: Option<u32>,
    pub oem: Option<u32>,
}

impl From<ProcessorConfig> for JsProcessorConfig {
    fn from(config: ProcessorConfig) -> Self {
        Self {
            processing_type: config.processing_type.to_string(),
            vision_config: config.vision_config.map(|c| c.into()),
            ocr_config: config.ocr_config.map(|c| c.into()),
        }
    }
}

impl From<JsProcessorConfig> for ProcessorConfig {
    fn from(config: JsProcessorConfig) -> Self {
        Self {
            processing_type: config.processing_type.into(),
            vision_config: config.vision_config.map(|c| c.into()),
            ocr_config: config.ocr_config.map(|c| c.into()),
        }
    }
}

impl From<VisionConfig> for JsVisionConfig {
    fn from(config: VisionConfig) -> Self {
        Self {
            url: config.url,
            api_key: config.api_key,
            model: config.model,
            prompt: config.prompt,
        }
    }
}

impl From<JsVisionConfig> for VisionConfig {
    fn from(config: JsVisionConfig) -> Self {
        Self {
            url: config.url,
            api_key: config.api_key,
            model: config.model,
            prompt: config.prompt,
        }
    }
}

impl From<OcrConfig> for JsOcrConfig {
    fn from(config: OcrConfig) -> Self {
        Self {
            ocr_model: config.ocr_model.to_string(),
            bounding_boxes: config.bounding_boxes,
            dpi: config.dpi,
            psm: config.psm,
            oem: config.oem,
        }
    }
}

impl From<JsOcrConfig> for OcrConfig {
    fn from(config: JsOcrConfig) -> Self {
        OcrConfig::new(
            config.ocr_model.into(),
            config.bounding_boxes,
            config.dpi,
            config.psm,
            config.oem,
        )
    }
}
