const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: [
    "<rootDir>/.next/", 
    "<rootDir>/node_modules/",
    "<rootDir>/react-email-starter/",
    "<rootDir>/email-list/",
    "<rootDir>/claude-remotion-demo/",
    "<rootDir>/portfolio-feature-flags/"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(@vercel/analytics|three|@react-three|framer-motion)/)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@vercel/analytics$": "<rootDir>/__mocks__/@vercel/analytics.js",
    "^motion/react$": "<rootDir>/__mocks__/motion/react.js",
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/coverage/',
    '/public/',
  ],
};

module.exports = createJestConfig(customJestConfig);
