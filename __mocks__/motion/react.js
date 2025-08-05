// Mock for motion/react
import React from 'react';

const mockMotionValue = {
  set: jest.fn(),
  get: jest.fn(() => 0),
  on: jest.fn(),
  onChange: jest.fn(),
  clearListeners: jest.fn(),
};

const mockUseSpring = jest.fn((initialValue, options) => {
  const motionValue = { ...mockMotionValue };
  motionValue.get = jest.fn(() => initialValue || 0);
  return motionValue;
});

const mockUseTransform = jest.fn((spring, transform) => {
  // Return the transformed value directly for testing
  const value = typeof spring === 'object' && spring.get ? spring.get() : (typeof spring === 'number' ? spring : 0);
  return transform(value);
});

const mockMotion = {
  main: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('main', { ...props, ref }, children)
  ),
  section: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('section', { ...props, ref }, children)
  ),
  span: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('span', { ...props, ref }, children)
  ),
  div: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('div', { ...props, ref }, children)
  ),
  button: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('button', { ...props, ref }, children)
  ),
  a: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('a', { ...props, ref }, children)
  ),
  p: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('p', { ...props, ref }, children)
  ),
  h3: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('h3', { ...props, ref }, children)
  ),
  svg: React.forwardRef(({ children, ...props }, ref) => 
    React.createElement('svg', { ...props, ref }, children)
  ),
};

export const motion = mockMotion;
export const useSpring = mockUseSpring;
export const useTransform = mockUseTransform;
export const useMotionValue = jest.fn(() => ({ ...mockMotionValue }));
export const useAnimation = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
}));

// Export commonly used animation values
export const AnimatePresence = ({ children }) => children;