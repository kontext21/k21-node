use k21::common::{ImageData, ImageDataCollection};

#[napi(object)]
#[derive(Clone)]
pub struct JsImageData {
    pub timestamp: String,
    pub frame_number: u32,
    pub content: String,
    pub processing_type: String,
}

impl From<ImageData> for JsImageData {
    fn from(data: ImageData) -> Self {
        Self {
            timestamp: data.timestamp().to_string(),
            frame_number: data.frame_number() as u32,
            content: data.content().to_string(),
            processing_type: data.processing_type().to_string(),
        }
    }
}

impl From<JsImageData> for ImageData {
    fn from(data: JsImageData) -> Self {
        ImageData::new(
            data.timestamp,
            data.frame_number as u64,
            data.content,
            data.processing_type.into(),
        )
    }
}

#[napi]
pub struct JsImageDataCollection {
    pub data: Vec<JsImageData>,
}

impl From<ImageDataCollection> for JsImageDataCollection {
    fn from(collection: ImageDataCollection) -> Self {
        JsImageDataCollection {
            data: collection.into_iter().map(|data| data.into()).collect(),
        }
    }
}

impl From<JsImageDataCollection> for ImageDataCollection {
    fn from(collection: JsImageDataCollection) -> Self {
        collection
            .data
            .into_iter()
            .map(|data| data.into())
            .collect()
    }
}
