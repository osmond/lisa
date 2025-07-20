module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.(svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
