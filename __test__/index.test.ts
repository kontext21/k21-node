// import k21 from '@k21'
import { K21Pipeline } from '@k21'
import fs from 'fs';
import path from 'path';
import os from 'os';

jest.setTimeout(20000);  // Set global timeout

describe('K21Pipeline', () => {
  let pipeline: K21Pipeline
  let tempDir: string;

  beforeEach(() => {
    pipeline = new K21Pipeline()
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
      expect(pipeline['capturer']).toBeNull()
      expect(pipeline['uploader']).toBeNull()
      expect(pipeline['processor']).toBeNull()
    })
  })

  describe('setCapturer', () => {
    test('should set basic config correctly', () => {
      const config = {
        fps: 1,
        recordLengthInSeconds: 5,
        saveVideo: false,
        saveScreenshot: false
      }
      pipeline.setCapturer(config)
      expect(pipeline['capturer']).toEqual({
        ...pipeline['defaultConfig'],
        ...config
      })
    })

    test('should set video config correctly', () => {
      const videoDir = path.join(tempDir, 'videos');
      fs.mkdirSync(videoDir, { recursive: true });

      const config = {
        fps: 1,
        recordLengthInSeconds: 5,
        saveVideo: true,
        outputDirVideo: videoDir,
        videoChunkDurationInSeconds: 10,
        saveScreenshot: false
      }
      pipeline.setCapturer(config)
      expect(pipeline['capturer']).toEqual({
        ...pipeline['defaultConfig'],
        ...pipeline['defaultConfigSaveVideo'],
        ...config
      })
    })

    test('should set screenshot config correctly', () => {
      const screenshotDir = path.join(tempDir, 'screenshots');
      fs.mkdirSync(screenshotDir, { recursive: true });

      const config = {
        fps: 1,
        recordLengthInSeconds: 5,
        saveVideo: false,
        saveScreenshot: true,
        outputDirScreenshot: screenshotDir
      }
      pipeline.setCapturer(config)
      expect(pipeline['capturer']).toEqual({
        ...pipeline['defaultConfig'],
        ...pipeline['defaultConfigSaveScreenshot'],
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
        recordLengthInSeconds: 5,
        saveVideo: true,
        outputDirVideo: videoDir,
        videoChunkDurationInSeconds: 10,
        saveScreenshot: true,
        outputDirScreenshot: screenshotDir
      }
      pipeline.setCapturer(config)
      expect(pipeline['capturer']).toEqual({
        ...pipeline['defaultConfig'],
        ...pipeline['defaultConfigSaveVideo'],
        ...pipeline['defaultConfigSaveScreenshot'],
        ...config
      })
    })

    test('should throw error when setting capturer with uploader present', () => {
      pipeline.setUploader('test-uploader')
      expect(() => pipeline.setCapturer({
        fps: 1,
        recordLengthInSeconds: 5,
        saveVideo: false,
        saveScreenshot: false
      })).toThrow('Cannot set Capturer when Uploader is already set')
    })
  })

  describe('setUploader', () => {
    test('should throw error when setting uploader with capturer present', () => {
      pipeline.setCapturer({
        fps: 1,
        recordLengthInSeconds: 5,
        saveVideo: false,
        saveScreenshot: false
      })
      expect(() => pipeline.setUploader('test-uploader')).toThrow(
        'Cannot set Uploader when Capturer is already set'
      )
    })
  })

  describe('run', () => {
    test('should throw error when neither capturer nor uploader is set', async () => {
      expect(pipeline.run()).rejects.toThrow(
        'Either Capturer or Uploader must be set'
      )
    })

    test('should run with basic capture config', async () => {
      const config = {
        fps: 1,
        recordLengthInSeconds: 5,
        saveVideo: false,
        saveScreenshot: false
      }
      pipeline.setCapturer(config)
      expect(pipeline.run()).resolves.not.toThrow()
    })

    test('should run with video capture config', async () => {
      const videoDir = path.join(tempDir, 'videos');
      fs.mkdirSync(videoDir, { recursive: true });

      const recordLengthInSeconds = 5
      const videoChunkDurationInSeconds = 10

      const fullChunks = Math.floor(recordLengthInSeconds / videoChunkDurationInSeconds)
      const extraChunk = recordLengthInSeconds % videoChunkDurationInSeconds > 0 ? 1 : 0
      const expectedNumberOfMp4Files = fullChunks + extraChunk

      const config = {
        fps: 1,
        recordLengthInSeconds,
        saveVideo: true,
        outputDirVideo: videoDir,
        videoChunkDurationInSeconds,
        saveScreenshot: false
      }
      pipeline.setCapturer(config)
      await expect(pipeline.run()).resolves.not.toThrow()


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
        recordLengthInSeconds,
        saveVideo: false,
        saveScreenshot: true,
        outputDirScreenshot: screenshotDir
      }
      pipeline.setCapturer(config)
      await expect(pipeline.run()).resolves.not.toThrow();

      // Check number of screenshots
      const files = fs.readdirSync(screenshotDir);
      const screenshots = files.filter(file => file.endsWith('.png'));
      expect(screenshots.length).toBe(fps * recordLengthInSeconds);
    })

    test('should return empty array for basic capture without processor', async () => {
      const config = {
        fps: 1,
        recordLengthInSeconds: 5,
        saveVideo: false,
        saveScreenshot: false
      }
      pipeline.setCapturer(config)
      const result = await pipeline.run()
      expect(result).toEqual([])
    })

    test('should return processed images when processor is set', async () => {
      const config = {
        fps: 1,
        recordLengthInSeconds: 2,
      }
      pipeline.setCapturer(config)
      pipeline.setProcessor({}) // Add mock processor

      const result = await pipeline.run()
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
