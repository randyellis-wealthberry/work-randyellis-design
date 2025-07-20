"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spotlight } from "@/components/ui/spotlight";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedNumberBasic } from "@/components/core/animated-number-basic";
import { AnimatedWebGL } from "@/components/ui/animated-webgl";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import { ChevronUp, Leaf, Users, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

const FEATURES = [
  {
    icon: <Leaf className="h-6 w-6" />,
    title: "Plant Discovery",
    description:
      "Discover new plants, learn growing techniques, and connect with a thriving community of garden enthusiasts.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Engagement",
    description:
      "Share your garden journey, get advice from experts, and inspire others with your growing success stories.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Goal Tracking",
    description:
      "Set gardening goals, track your progress, and celebrate milestones in your plant-growing journey.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Growth Analytics",
    description:
      "Monitor plant health, track growth patterns, and optimize your gardening strategy with data insights.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Plant & Discover",
    content:
      "Start your gardening journey by planting seeds or seedlings. Discover new varieties and learn optimal growing conditions for each plant type.",
  },
  {
    title: "Community & Connect",
    content:
      "Join a vibrant community of gardeners. Share photos, ask questions, and learn from experienced growers around the world.",
  },
  {
    title: "Track & Optimize",
    content:
      "Monitor your plants' progress with smart tracking tools. Get personalized recommendations to improve your gardening success.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Home Gardener",
    content:
      "This platform transformed my black thumb into a green one. The community support is incredible!",
    avatar: "SC",
  },
  {
    name: "Mike Rodriguez",
    role: "Urban Farmer",
    content:
      "Perfect for tracking my container garden. The analytics help me optimize growth like never before.",
    avatar: "MR",
  },
  {
    name: "Emma Thompson",
    role: "Plant Enthusiast",
    content:
      "Found my gardening tribe here. The knowledge sharing and encouragement keep me motivated daily.",
    avatar: "ET",
  },
];

function ProcessStepsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const variants = {
    enter: { opacity: 0, y: 20, filter: "blur(4px)" },
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -20, filter: "blur(4px)" },
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {PROCESS_STEPS.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeIndex === index
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            Step {index + 1}
          </button>
        ))}
      </div>
      <TransitionPanel
        activeIndex={activeIndex}
        variants={variants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-[120px] rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900/50"
      >
        {PROCESS_STEPS.map((step, index) => (
          <div key={index} className="space-y-3">
            <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {step.title}
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {step.content}
            </p>
          </div>
        ))}
      </TransitionPanel>
    </div>
  );
}

function GrowItFAQ() {
  return (
    <Accordion
      className="flex w-full flex-col divide-y divide-zinc-200 dark:divide-zinc-700"
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <AccordionItem value="getting-started" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>How do I get started with gardening?</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            Start small with easy-to-grow plants like herbs or lettuce. Our
            community provides step-by-step guides, and you can connect with
            mentors who&apos;ll help you every step of the way. The platform
            includes plant recommendations based on your location and experience
            level.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="community-benefits" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>What makes the community special?</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            Our community brings together gardeners from all experience levels.
            Share photos of your progress, get expert advice on plant problems,
            and celebrate successes together. The platform fosters meaningful
            connections through shared passion for growing.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tracking-features" className="py-2">
        <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center justify-between">
            <div>How does plant tracking work?</div>
            <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-zinc-500 dark:text-zinc-400">
            Track watering schedules, growth milestones, and harvest dates.
            Upload photos to document progress and get AI-powered insights about
            plant health. Set reminders for care tasks and receive personalized
            recommendations to optimize growing conditions.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function GrowItPage() {
  return (
    <motion.main
      className="space-y-32 sm:space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <Badge variant="secondary" className="mb-4">
            Social Gardening Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50">
            Grow Together
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A thriving community where gardening enthusiasts connect, share
            knowledge, and celebrate the joy of growing plants together.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Magnetic springOptions={{ bounce: 0 }} intensity={0.2}>
            <Button
              size="lg"
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Start Growing
            </Button>
          </Magnetic>
          <Magnetic springOptions={{ bounce: 0 }} intensity={0.2}>
            <Button variant="outline" size="lg">
              Explore Community
            </Button>
          </Magnetic>
        </div>

        {/* Hero Visual */}
        <div className="mt-12">
          <AnimatedWebGL
            sceneType="organic"
            color="#22c55e"
            speed={1.0}
            intensity={0.6}
            className="w-full h-64 sm:h-80 rounded-xl"
          />
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              <AnimatedNumberBasic />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Active Gardeners
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              2.5M+
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Plants Tracked
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              95%
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Success Rate
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              4.8★
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              App Rating
            </p>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
          Everything you need to grow
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              className="border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Process Steps */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
          Your Growing Journey
        </h2>
        <ProcessStepsSection />
      </motion.section>

      {/* Testimonials */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
          Community Stories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card key={index} className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-400 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <GrowItFAQ />
      </motion.section>

      {/* Call to Action */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="text-center space-y-6 py-16"
      >
        <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
          <Spotlight
            className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
            size={64}
          />
          <div className="relative h-full w-full rounded-[15px] bg-white p-8 dark:bg-zinc-950">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Ready to start your garden?
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Join thousands of gardeners who are growing together, sharing
                knowledge, and celebrating the joy of nurturing plants.
              </p>
              <div className="pt-4">
                <Magnetic springOptions={{ bounce: 0 }} intensity={0.2}>
                  <Button
                    size="lg"
                    className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Join the Community
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
}
