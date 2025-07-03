"use client";

import { useSpring, animated } from "@react-spring/web";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  decimalPlaces?: number;
  springOptions?: {
    bounce?: number;
    duration?: number;
  };
}

export function AnimatedNumber({
  value,
  className = "",
  decimalPlaces,
  springOptions = {},
}: AnimatedNumberProps) {
  const { duration = 1000 } = springOptions;

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: {
      tension: 170,
      friction: 26,
      duration,
    },
  });

  return (
    <animated.span className={className}>
      {number.to((n) =>
        decimalPlaces !== undefined
          ? parseFloat(n.toFixed(decimalPlaces)).toString()
          : Math.floor(n).toString(),
      )}
    </animated.span>
  );
}
