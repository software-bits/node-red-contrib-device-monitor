module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  resetMocks: true,
  coveragePathIgnorePatterns: [
    'test',
  ],
  collectCoverage: true,
};
