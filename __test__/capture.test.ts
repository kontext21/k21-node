import { K21 } from '@k21'
import fs from 'fs';
import path from 'path';
import os from 'os';
// import { FileConfig, ImageData } from '@k21/types';

jest.setTimeout(20000);  // Set global timeout

const defaultCaptureConfigTest = {
    fps: 1,
    duration: 2,
    videoChunkDuration: 1,
}

describe('K21', () => {
  let k21: K21
  let tempDir: string;
  let testVideoPath: string;

  beforeEach(() => {
    k21 = new K21()
    // Create unique temp directory for each test
    tempDir = path.join(os.tmpdir(), `k21-test-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    testVideoPath = path.join(tempDir, 'output-0.mp4');
    // Create an empty test video file
    fs.writeFileSync(testVideoPath, '');
  })

  afterEach(() => {
    // Clean up temp directory after each test
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('initialization', () => {
    test('should initialize with null values', () => {
      expect(k21['capturer']).toBeNull()
    })
  })

  describe('setCapturer', () => {
    test('should set basic config correctly', () => {
      const config = {
        ...defaultCaptureConfigTest,
      }
      k21.setCapturer(config)
      expect(k21['capturer']).toEqual({
        ...k21['defaultConfig'],
        ...config
      })
    })

    test('should set video config correctly', () => {
      const videoDir = path.join(tempDir, 'videos');
      fs.mkdirSync(videoDir, { recursive: true });

      const config = {
        ...defaultCaptureConfigTest
       }

      k21.setCapturer(config)
      expect(k21['capturer']).toEqual({
        ...k21['defaultConfig'],
        ...k21['defaultConfigSaveVideo'],
        ...config
      })
    })

    test('should set screenshot config correctly', () => {
      const screenshotDir = path.join(tempDir, 'screenshots');
      fs.mkdirSync(screenshotDir, { recursive: true });

      const config = {
        ...defaultCaptureConfigTest,
      }
      k21.setCapturer(config)
      expect(k21['capturer']).toEqual({
        ...k21['defaultConfig'],
        ...k21['defaultConfigSaveScreenshot'],
        ...config
      })
    })

    test('should set both video and screenshot config correctly', () => {
      const videoDir = path.join(tempDir, 'videos');
      const screenshotDir = path.join(tempDir, 'screenshots');
      fs.mkdirSync(videoDir, { recursive: true });
      fs.mkdirSync(screenshotDir, { recursive: true });

      const config = {
        ...defaultCaptureConfigTest,
        saveVideoTo: tempDir,
        saveScreenshotTo: tempDir,
      }
      k21.setCapturer(config)
      expect(k21['capturer']).toEqual({
        ...k21['defaultConfig'],
        ...k21['defaultConfigSaveVideo'],
        ...k21['defaultConfigSaveScreenshot'],
        ...config
      })
    })

    test('should throw error when setting capturer with uploader present', () => {
      k21.setCapturerFromFile({
        file: "/Users/ferzu/k21-node-sample/output-0.mp4"
      })
      expect(() => k21.setCapturer({
        ...defaultCaptureConfigTest,
        saveVideoTo: tempDir,
        saveScreenshotTo: tempDir,
        })).toThrow('Cannot set Capturer when Uploader is already set')
    })

    test('should throw error when wrong path is provided', async () => {
      expect(() => k21.setCapturer({
        fps:1,
        duration: 3,
        saveVideoTo: "wrong/path",
        saveScreenshotTo: "wrong/path"
      })).toThrow('Invalid path: wrong/path')
    })
  })
})
