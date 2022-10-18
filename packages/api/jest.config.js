module.exports = {
  preset: "ts-jest",
  collectCoverage: process.env.CI ? true : false,
  collectCoverageFrom: [
    "./src/**/*.ts"
  ],
  testRegex: ".\/tests\/.*.test.ts$",
  transform: {
    ".(ts|tsx)": ["ts-jest", { "tsconfig": "./tests/tsconfig.json" }]
  },
  transformIgnorePatterns: ["^.+\\.js$"],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  coverageDirectory: './tests/coverage',
}