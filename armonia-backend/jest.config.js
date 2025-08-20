module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: 'src/.*\.spec\.ts$',
  transform: {
    '^.+\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '\.integration\.spec\.ts$'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/../node_modules/@prisma/client/index.js',
  },
};