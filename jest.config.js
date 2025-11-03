/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.module\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.(css|scss|sass)$": "<rootDir>/test/styleMock.js",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/test/fileMock.js",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
