const { pathsToModuleNameMapper } = require('ts-jest');
const { readFileSync } = require('fs');
const { join } = require('path');

const tsConfig = JSON.parse(readFileSync(join(__dirname, './tsconfig.json'), 'utf8'));

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testMatch: ['<rootDir>/dist/src/**/*.spec.js', '<rootDir>/dist/test/**/*.spec.js'],
  transform: {},
  collectCoverageFrom: ['dist/src/**/*.(js)'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePaths: [tsConfig.compilerOptions.baseUrl],
  moduleNameMapper: {
    '^@nestjs/(.*)$' : '<rootDir>/node_modules/@nestjs/$1',
    '^src/(.*)$': '<rootDir>/dist/src/$1',
    '^lib/logging/activity-logger$':
      '<rootDir>/dist/src/lib/logging/activity-logger.js',
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/dist/' }),
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};

module.exports = jestConfig;