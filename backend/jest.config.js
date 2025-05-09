const config = {
  clearMocks: true,
  coverageProvider: "v8",
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/jest.setup.js'],
};

module.exports = config;
