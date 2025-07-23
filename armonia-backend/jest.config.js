const { pathsToModuleNameMapper } = require('ts-jest');
const { readFileSync } = require('fs');
const { join } = require('path');

const tsConfig = JSON.parse(readFileSync(join(__dirname, './tsconfig.json'), 'utf8'));

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePaths: [tsConfig.compilerOptions.baseUrl],
  moduleNameMapper: {
    '^@nestjs/(.*)$': '<rootDir>/node_modules/@nestjs/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^lib/logging/activity-logger$':
      '<rootDir>/src/lib/logging/activity-logger.ts',
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};

module.exports = jestConfig;
