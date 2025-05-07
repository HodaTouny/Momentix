const config = {
  clearMocks: true,
  coverageProvider: "v8",
  setupFilesAfterEnv: ['<rootDir>/__tests__/testHelpers.js'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/testHelpers.js'],
};

module.exports = config;
