import type { Config } from "jest";

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/store/(.*)$": "<rootDir>/src/store/$1",
    "^@/constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@/common/(.*)$": "<rootDir>/src/common/$1",
    "^.+\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\.(ts|tsx|js|jsx|mjs)$": [
      "babel-jest",
      { configFile: "./babel.config.jest.js" },
    ],
  },
  transformIgnorePatterns: [], // Temporarily transpile all node_modules to debug syntax errors
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: [
    "/e2e/",
    "/dist-jest/",
    "<rootDir>/armonia-backend/",
  ],
  modulePathIgnorePatterns: ["<rootDir>/dist-jest/"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/mocks/**",
    "!src/types/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  modulePaths: ["<rootDir>/src"], // Add this line
};

export default config;
