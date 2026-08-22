"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

/**
 * Entrance motion moves; it never hides. The quote is painted before the
 * observer fires and only settles when it does, so a reader whose scroll never
 * reaches it still has the words.
 */
const PANEL_VARIANTS = {
  hidden: { opacity: 1, y: 8 },
  visible: { opacity: 1, y: 0 },
};

/** Controls are 44px targets in the zinc ramp — no fill, no lift, no shadow. */
const ARROW_BUTTON =
  "static h-11 w-11 translate-x-0 translate-y-0 rounded-lg border-zinc-300 bg-transparent text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:opacity-40 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-900 dark:focus-visible:ring-white";

function Quote({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <figure className="py-8">
      {/* The words are the assertion; the attribution stays subordinate. */}
      <blockquote className="max-w-[68ch] text-lg leading-[1.6] text-zinc-900 dark:text-white">
        {`“${testimonial.quote}”`}
      </blockquote>
      <figcaption className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="block text-zinc-900 dark:text-white">
          {testimonial.author}
        </span>
        {testimonial.role}
      </figcaption>
    </figure>
  );
}

/**
 * One recommendation at a time, bounded by hairlines rather than held in a
 * card: a quote is for reading, and three of them truncated side by side is a
 * card grid pretending to be proof.
 */
export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  className,
  autoPlay = false,
  autoPlayInterval = 4000,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Advancing on a timer takes the page away from someone mid-sentence, so it
  // stops while they are hovering or tabbing through it, and never runs at all
  // when the reader has asked for less motion.
  React.useEffect(() => {
    if (!api || !autoPlay || paused || reduceMotion) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [api, autoPlay, autoPlayInterval, paused, reduceMotion]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("w-full", className)}
      variants={PANEL_VARIANTS}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi}
        className="w-full border-t border-zinc-200 dark:border-zinc-800"
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={`${testimonial.author}-${index}`}>
              <Quote testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <CarouselPrevious className={ARROW_BUTTON} />
            <CarouselNext className={ARROW_BUTTON} />
            {count > 1 && (
              <p className="text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
                {current} / {count}
              </p>
            )}
          </div>

          {count > 1 && (
            <div className="flex gap-1">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  // The dot is 8px; the target around it is 44px.
                  className="flex h-11 w-6 cursor-pointer items-center justify-center rounded-md focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-white"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={current === index + 1 ? "true" : undefined}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      current === index + 1
                        ? "bg-zinc-900 dark:bg-white"
                        : "bg-zinc-300 dark:bg-zinc-700",
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Carousel>
    </motion.div>
  );
};

/**
 * The same quote panel where the surrounding surface is already tight — no
 * pager, just the arrows.
 */
export const TestimonialCarouselCompact: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [api, setApi] = React.useState<CarouselApi>();
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api || !autoPlay || paused || reduceMotion) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [api, autoPlay, autoPlayInterval, paused, reduceMotion]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("w-full", className)}
      variants={PANEL_VARIANTS}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi}
        className="w-full border-t border-zinc-200 dark:border-zinc-800"
        opts={{ align: "center", loop: true }}
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={`${testimonial.author}-${index}`}>
              <Quote testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <CarouselPrevious className={ARROW_BUTTON} />
          <CarouselNext className={ARROW_BUTTON} />
        </div>
      </Carousel>
    </motion.div>
  );
};
