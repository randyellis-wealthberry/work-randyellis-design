const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@vercel/analytics)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@vercel/analytics$': '<rootDir>/__mocks__/@vercel/analytics.js',
    '^motion/react$': '<rootDir>/__mocks__/motion/react.js',
  },
}

module.exports = createJestConfig(customJestConfig)