// Mock for web-vitals library - CommonJS format for Jest compatibility
const getCLS = jest.fn();
const getFID = jest.fn();
const getFCP = jest.fn();
const getLCP = jest.fn();
const getTTFB = jest.fn();
const onCLS = jest.fn();
const onFID = jest.fn();
const onFCP = jest.fn();
const onLCP = jest.fn();
const onTTFB = jest.fn();

// Mock metric interface for TypeScript
interface Metric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  entries: any[];
  id: string;
}

// CommonJS exports
module.exports = {
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
  onCLS,
  onFID,
  onFCP,
  onLCP,
  onTTFB,
};

// Support for both default and named exports
module.exports.default = module.exports;
