// Complete mock for motion/react
import React from 'react';

// Mock motion value
const mockMotionValue = {
  set: jest.fn(),
  get: jest.fn(() => 0),
  on: jest.fn(),
  onChange: jest.fn(),
  clearListeners: jest.fn(),
};

// Mock hooks
export const useSpring = jest.fn((initialValue) => {
  const motionValue = { ...mockMotionValue };
  motionValue.get = jest.fn(() => initialValue || 0);
  return motionValue;
});

export const useTransform = jest.fn((spring, transform) => {
  const value = typeof spring === 'object' && spring.get ? spring.get() : (typeof spring === 'number' ? spring : 0);
  return transform ? transform(value) : value;
});

export const useMotionValue = jest.fn(() => ({ ...mockMotionValue }));

export const useAnimation = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
}));

// Create motion components for all HTML elements - simplified version
const createMotionComponent = (element) => {
  return React.forwardRef(({ 
    children, 
    variants, 
    initial, 
    animate, 
    exit, 
    transition,
    onAnimationComplete,
    onAnimationStart,
    ...props 
  }, ref) => {
    // Filter out animation props that don't belong on DOM elements
    const { 
      variants: _, 
      initial: __, 
      animate: ___, 
      exit: ____, 
      transition: _____, 
      onAnimationComplete: ______,
      onAnimationStart: _______,
      ...domProps 
    } = props;

    return React.createElement(element, {
      ...domProps,
      ref,
      'data-motion-component': element,
    }, children);
  });
};

// Create all the motion components
export const motion = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  p: createMotionComponent('p'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
  h5: createMotionComponent('h5'),
  h6: createMotionComponent('h6'),
  a: createMotionComponent('a'),
  button: createMotionComponent('button'),
  img: createMotionComponent('img'),
  svg: createMotionComponent('svg'),
  main: createMotionComponent('main'),
  section: createMotionComponent('section'),
  article: createMotionComponent('article'),
  aside: createMotionComponent('aside'),
  header: createMotionComponent('header'),
  footer: createMotionComponent('footer'),
  nav: createMotionComponent('nav'),
  ul: createMotionComponent('ul'),
  ol: createMotionComponent('ol'),
  li: createMotionComponent('li'),
};

// AnimatePresence component
export const AnimatePresence = ({ children, mode, ...props }) => {
  return React.createElement('div', { 
    'data-animate-presence': true, 
    ...props 
  }, children);
};

// Export TypeScript types (these are just for runtime compatibility)
export const Variants = {};
export const Transition = {};
export const Variant = {};
export const TargetAndTransition = {};