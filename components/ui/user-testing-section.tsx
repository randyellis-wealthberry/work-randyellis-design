"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface UserTestingResult {
  label: string;
  value: string;
}

export interface UserTestingTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface UserTestingData {
  methodology: string;
  environment: string;
  protocol: string;
  results: UserTestingResult[];
  testimonials: UserTestingTestimonial[];
}

interface UserTestingSectionProps {
  data: UserTestingData;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const UserTestingSection: React.FC<UserTestingSectionProps> = ({
  data,
  className,
}) => {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { methodology, environment, protocol, results, testimonials } = data;

  return (
    <motion.section
      ref={ref}
      className={cn("space-y-8", className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Section Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h2
          className="text-2xl font-semibold tracking-tight"
          data-testid="section-title"
        >
          User Testing & Validation
        </h2>
        <p className="text-muted-foreground">
          Comprehensive testing methodology and results from real student
          athletes
        </p>
      </motion.div>

      {/* Testing Overview Cards */}
      <motion.div
        variants={itemVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Methodology Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">Method</Badge>
              Testing Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              {methodology}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Environment Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">Location</Badge>
              Testing Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription
              className="text-sm leading-relaxed"
              data-testid="environment-text"
            >
              {environment}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Protocol Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">Process</Badge>
              Testing Protocol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              {protocol}
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-lg font-medium">Testing Results</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {result.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Insights Accordion */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-lg font-medium">Testing Insights</h3>
        <Accordion type="single" collapsible={true} className="w-full">
          <AccordionItem value="methodology-details">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Deep Dive</Badge>
                Methodology & Approach
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our user testing methodology focused on authentic environments
                where student athletes naturally use mobile apps. By conducting
                tests in school libraries and hallways rather than controlled
                lab environments, we captured real-world usage patterns
                including network connectivity challenges, social dynamics, and
                time pressure factors.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Real Environment</Badge>
                <Badge variant="outline">Multiple Devices</Badge>
                <Badge variant="outline">Authentic Tasks</Badge>
                <Badge variant="outline">Social Context</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="key-findings">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Insights</Badge>
                Key Findings & Learnings
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Student athletes prioritized speed and simplicity over advanced
                features. The most successful interactions occurred when users
                could complete their highlight reel creation in under 3 minutes.
                Social validation through immediate sharing capabilities proved
                essential for sustained engagement.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Speed Priority</Badge>
                <Badge variant="outline">Social Validation</Badge>
                <Badge variant="outline">Cross-Platform</Badge>
                <Badge variant="outline">Mobile-First</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Student Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-medium">Student Feedback</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-${index}`}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <blockquote className="space-y-4">
                      <p className="text-sm italic text-muted-foreground leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <footer className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                          {testimonial.author}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {testimonial.role}
                        </Badge>
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};
