// Mock for @vercel/analytics
module.exports = {
  track: jest.fn(),
  Analytics: () => null,
};
