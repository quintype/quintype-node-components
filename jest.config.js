module.exports = {
  verbose: true,
  transform: { "^.+\\.js$": "<rootDir>/jestPreprocess.js" },
  testEnvironment: "jsdom",
};

module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  }
};
