#![allow(clippy::transmute_undefined_repr)]

#[macro_use]
extern crate napi_derive;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[napi]
pub fn version() -> &'static str {
    VERSION
}

pub mod capture;
pub mod image;
pub mod pipeline;
pub mod process;
pub mod types;
