import { pathsToModuleNameMapper } from "ts-jest";
import {compilerOptions} from "./tsconfig.json";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  moduleDirectories: ["node_modules", "./k21"],
  moduleFileExtensions: ["js", "ts"],
  // setupFilesAfterEnv : ["<rootDir>/__test__/setup.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/k21" }),
  testPathIgnorePatterns: ["<rootDir>/__test__/setup.ts"],
  transform: {
    '^.+\\.{ts|tsx}?$': ['ts-jest', {
      tsConfig: 'tsconfig.json',
    }],
  },
};
