import { K21 } from '@k21'
import fs from 'fs';
import path from 'path';
import os from 'os';
import { CaptureConfig, ProcessedFrameData } from '@k21/types';

jest.setTimeout(20000);  // Set global timeout

const defaultCaptureConfigTest = {
    fps: 1,
    duration: 1,
    videoChunkDuration: 1,
}

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

  describe('setUploader', () => {
    test('should throw error when setting uploader with capturer present', () => {
      k21.setCapturer({
        ...defaultCaptureConfigTest
      })
      const testVideoPath = "./__test__/resources/test-output-10s.mp4"
      expect(() =>       k21.setCapturerFromFile({
        file: testVideoPath
      })).toThrow(
        'Cannot set Uploader when Capturer is already set'
      )
    })

    test('should process video correctly', async () => {
      const testVideoPath = "./__test__/resources/test-output-10s.mp4"

      k21.setCapturerFromFile({
        file: testVideoPath
      })

      k21.setProcessor()

      const result: ProcessedFrameData[] = await k21.run()
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    test('should process screenshot correctly', async () => {
      const testVideoPath = "./__test__/resources/test-screenshot.png"

      k21.setCapturerFromFile({
        file: testVideoPath
      })

      k21.setProcessor()

      const result: ProcessedFrameData[] = await k21.run()
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })
})

  describe('run', () => {
    test('should throw error when neither capturer nor uploader is set', async () => {
      await expect(k21.run()).rejects.toThrow(
        'Invalid configuration. Must have either: ' +
                '1) Capturer only, ' +
                '2) Capturer with Processor, or ' +
                '3) Uploader with Processor'
      )
    })

    test('should run with basic capture config', async () => {
      const k21 = new K21()
      const config: CaptureConfig = {
        ...defaultCaptureConfigTest
      }
      k21.setCapturer(config)
      await expect(k21.run()).resolves.toBeDefined();
    })

    test('should run with video capture config', async () => {
      const videoDir = path.join(tempDir, 'videos');
      fs.mkdirSync(videoDir, { recursive: true });

      const duration = 3
      const fullChunks = Math.floor(duration / defaultCaptureConfigTest.videoChunkDuration!)
      const extraChunk = duration % defaultCaptureConfigTest.videoChunkDuration! > 0 ? 1 : 0
      const expectedNumberOfMp4Files = fullChunks + extraChunk

      const config: CaptureConfig = {
        ...defaultCaptureConfigTest,
        saveVideoTo: videoDir,
        duration: duration,
      }
      k21.setCapturer(config)
      await expect(k21.run()).resolves.toBeDefined();

      // Check for video file
      const files = fs.readdirSync(videoDir);
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

      const config = {
        ...defaultCaptureConfigTest,
        saveScreenshotTo: screenshotDir,
        }
      k21.setCapturer(config)
      const result = await k21.run()
      expect(result).toBeDefined();

      // Check number of screenshots
      const files = fs.readdirSync(screenshotDir);
      const screenshots = files.filter(file => file.endsWith('.png'));
      expect(screenshots.length).toBe(defaultCaptureConfigTest.fps! * defaultCaptureConfigTest.duration!);
    })

    test('should return empty array for basic capture without processor', async () => {
      const config = {
        ...defaultCaptureConfigTest
      }
      k21.setCapturer(config)
      const result = await k21.run()
      expect(result).toEqual([])
    })

    test('should return processed images when processor is set', async () => {
      const config = {
        ...defaultCaptureConfigTest
      }
      k21.setCapturer(config)
      k21.setProcessor({}) // Add mock processor

      const result = await k21.run()
      expect(result).toBeDefined()
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