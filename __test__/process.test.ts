import { K21 } from '@k21'
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('K21', () => {
    // let k21: K21
  
    // beforeEach(() => {
    //   k21 = new K21()
    //   // Create unique temp directory for each test
    //   tempDir = path.join(os.tmpdir(), `k21-test-${Date.now()}`);
    //   fs.mkdirSync(tempDir, { recursive: true });
    // })
  
    // afterEach(() => {
    //   // Clean up temp directory after each test
    //   if (fs.existsSync(tempDir)) {
    //     fs.rmSync(tempDir, { recursive: true, force: true });
    //   }
    // });
  
    describe('initialization', () => {
        const k21 = new K21()
      test('should initialize with null values', () => {
        expect(k21['capturer']).toBeNull()
      })
    })

    describe('setProcessor', () => {
        test('should set processor correctly', () => {
            const k21 = new K21()
            k21.setProcessor()
            expect(k21['processor']).toEqual({
                ...k21['defaultProcessorConfig'],
            })
        })

        // test('should throw error when image3Text not in enum', () => {
        //     k21.setProcessor({
        //         processingType: 'OCR-bla'
        //     })
        //     expect(() => k21.run()).toThrow()
        // })
    })

})
  