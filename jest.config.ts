module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    '/node_modules/(?!(.*@xyflow/react.*|.*@testing-library.*))'
  ],
};
