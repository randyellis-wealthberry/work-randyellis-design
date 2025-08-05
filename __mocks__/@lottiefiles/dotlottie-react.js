// Mock for @lottiefiles/dotlottie-react
const React = require('react');

const DotLottieReact = React.forwardRef(({ src, autoplay, loop, ...props }, ref) => {
  return React.createElement('div', {
    'data-testid': 'dotlottie-player',
    'data-src': src,
    'data-autoplay': autoplay,
    'data-loop': loop,
    ref,
    ...props
  });
});

DotLottieReact.displayName = 'DotLottieReact';

module.exports = {
  DotLottieReact,
  // Export as default as well for ES6 imports
  default: DotLottieReact,
};