"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  className,
  autoPlay = false,
  autoPlayInterval = 4000,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-play functionality
  React.useEffect(() => {
    if (!api || !autoPlay) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [api, autoPlay, autoPlayInterval]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("w-full space-y-4", className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={`${testimonial.author}-${index}`}
              className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
            >
              <motion.div variants={itemVariants} className="h-full">
                <Card className="flex h-full flex-col">
                  <CardHeader className="flex-none">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">
                        {testimonial.author}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {testimonial.role}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-start pt-0">
                    <blockquote className="text-muted-foreground text-sm leading-relaxed italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
          {/* Pagination Dots */}
          {count > 1 && (
            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-200",
                    current === index + 1
                      ? "bg-primary"
                      : "bg-muted hover:bg-muted-foreground/50",
                  )}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Carousel>

      {/* Progress Indicator */}
      {count > 1 && (
        <div className="text-center">
          <p className="text-muted-foreground text-xs">
            {current} of {count}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Alternative compact version for smaller spaces
export const TestimonialCarouselCompact: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api || !autoPlay) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [api, autoPlay, autoPlayInterval]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("w-full", className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={`${testimonial.author}-${index}`}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent className="p-6">
                    <blockquote className="space-y-4">
                      <p className="text-muted-foreground text-center text-sm leading-relaxed italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <footer className="space-y-1 text-center">
                        <div className="text-sm font-medium">
                          {testimonial.author}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {testimonial.role}
                        </div>
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </motion.div>
  );
};
