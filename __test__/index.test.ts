// import k21 from '@k21'
import { K21 } from '@k21'
import fs from 'fs';
import path from 'path';
import os from 'os';

jest.setTimeout(20000);  // Set global timeout

describe('K21', () => {
  let k21: K21
  let tempDir: string;

  beforeEach(() => {
    k21 = new K21()
    // Create unique temp directory for each test
    tempDir = path.join(os.tmpdir(), `k21-test-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
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
      expect(k21['uploader']).toBeNull()
      expect(k21['processor']).toBeNull()
    })
  })

  describe('setCapturer', () => {
    test('should set basic config correctly', () => {
      const config = {
        fps: 1,
        duration: 5,
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
        fps: 1,
        duration: 5,
        saveVideoTo: videoDir,
        videoChunkDuration: 10,
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
        fps: 1,
        duration: 5,
        saveScreenshotTo: screenshotDir
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
        fps: 1,
        duration: 5,
        saveScreenshotTo: screenshotDir,
        saveVideoTo: videoDir,
        videoChunkDuration: 10,
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
      k21.setUploader('test-uploader')
      expect(() => k21.setCapturer({
        fps: 1,
        duration: 5
        })).toThrow('Cannot set Capturer when Uploader is already set')
    })
  })

  describe('setUploader', () => {
    test('should throw error when setting uploader with capturer present', () => {
      k21.setCapturer({
        fps: 1,
        duration: 5
      })
      expect(() => k21.setUploader('test-uploader')).toThrow(
        'Cannot set Uploader when Capturer is already set'
      )
    })
  })

  describe('run', () => {
    test('should throw error when neither capturer nor uploader is set', async () => {
      expect(k21.run()).rejects.toThrow(
        'Either Capturer or Uploader must be set'
      )
    })

    test('should run with basic capture config', async () => {
      const config = {
        fps: 1,
        duration: 5
      }
      k21.setCapturer(config)
      expect(k21.run()).resolves.not.toThrow()
    })

    test('should run with video capture config', async () => {
      const videoDir = path.join(tempDir, 'videos');
      fs.mkdirSync(videoDir, { recursive: true });

      const duration = 5
      const videoChunkDuration = 10

      const fullChunks = Math.floor(duration / videoChunkDuration)
      const extraChunk = duration % videoChunkDuration > 0 ? 1 : 0
      const expectedNumberOfMp4Files = fullChunks + extraChunk

      const config = {
        fps: 1,
        duration: duration,
        saveVideoTo: videoDir,
        videoChunkDuration: videoChunkDuration,
      }
      k21.setCapturer(config)
      await expect(k21.run()).resolves.not.toThrow()


      // Check for video file
      const files = fs.readdirSync(videoDir);
      console.log(files)
      const videos = files.filter(file => file.endsWith('.mp4'));
      expect(videos.length).toBe(expectedNumberOfMp4Files);  // Expect one video file
      
      // Optionally, check if file size is greater than 0
      const videoPath = path.join(videoDir, videos[0]);
      const stats = fs.statSync(videoPath);
      expect(stats.size).toBeGreaterThan(0);
    })

    test('should run with screenshot capture config', async () => {
      const screenshotDir = path.join(tempDir, 'screenshots');
      fs.mkdirSync(screenshotDir, { recursive: true });

      const fps = 1
      const recordLengthInSeconds = 5

      const config = {
        fps,
        duration: recordLengthInSeconds,
        saveScreenshotTo: screenshotDir
        }
      k21.setCapturer(config)
      await expect(k21.run()).resolves.not.toThrow();

      // Check number of screenshots
      const files = fs.readdirSync(screenshotDir);
      const screenshots = files.filter(file => file.endsWith('.png'));
      expect(screenshots.length).toBe(fps * recordLengthInSeconds);
    })

    test('should return empty array for basic capture without processor', async () => {
      const config = {
        fps: 1,
        duration: 5
      }
      k21.setCapturer(config)
      const result = await k21.run()
      expect(result).toEqual([])
    })

    test('should return processed images when processor is set', async () => {
      const config = {
        fps: 1,
        duration: 2,
      }
      k21.setCapturer(config)
      k21.setProcessor({}) // Add mock processor

      const result = await k21.run()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      // Check structure of returned ImageData objects
      result.forEach(item => {
        expect(item).toMatchObject({
          timestamp: expect.any(String),
          frameNumber: expect.any(Number),
          content: expect.any(String),
          processingType: expect.any(String)
        })
      })
    })
  })
})
