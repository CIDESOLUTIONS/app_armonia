module.exports = {
  setupFiles: ['<rootDir>/test/integration-setup.js'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: 'src/.*\.integration\.spec\.ts$',
  transform: {
    '^.+\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/../node_modules/@prisma/client/index.js',
  },
};