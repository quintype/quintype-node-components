module.exports = {
  verbose: true,
  transform: { "^.+\\.js$": "<rootDir>/jestPreprocess.js" },
  testEnvironment: "jsdom",
};
