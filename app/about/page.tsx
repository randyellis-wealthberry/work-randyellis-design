import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Award,
  Users,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { getEmail } from "../data";

export const metadata: Metadata = {
  title: "About Randy Ellis - AI Product Design Engineer & Leader",
  description:
    "Learn about Randy Ellis's journey from design leadership to AI product engineering. Head of Product at Wealthberry Labs with 2.5M+ users impacted, 6 design awards, and $50M in product value.",
  keywords: [
    "Randy Ellis About",
    "AI Product Design Engineer Biography",
    "Wealthberry Labs Head of Product",
    "Design Leadership Career",
    "AI Design Expert Background",
    "Product Design Experience",
    "Nagarro Head of Design",
    "Design Engineering Leader",
  ],
  openGraph: {
    title: "About Randy Ellis - AI Product Design Engineer & Leader",
    description:
      "From design leadership to AI innovation: 2.5M+ users impacted, 6 design awards, $50M in product value delivered.",
    url: "https://work.randyellis.design/about",
  },
};

const achievements = [
  {
    icon: Users,
    value: "2.5M+",
    label: "Users Impacted",
    description: "Across multiple products and platforms",
  },
  {
    icon: Award,
    value: "6",
    label: "Design Awards",
    description: "Recognition for innovative design work",
  },
  {
    icon: TrendingUp,
    value: "$50M",
    label: "Product Value",
    description: "Generated through strategic design decisions",
  },
  {
    icon: Lightbulb,
    value: "800+",
    label: "Designers Mentored",
    description: "Growing the next generation of design talent",
  },
];

const experience = [
  {
    company: "Wealthberry Labs",
    title: "Head of Product",
    period: "2022 - Present",
    description:
      "Leading product strategy and development for AI-powered financial planning tools. Driving innovation in generative AI applications for wealth management.",
    achievements: [
      "Launched AI-powered financial planning platform",
      "Led product team of 12+ engineers and designers",
      "Implemented design system used across 5+ products",
      "Achieved 40% improvement in user engagement metrics",
    ],
  },
  {
    company: "Clockwork",
    title: "Lead UX Researcher (Consultant)",
    period: "2023",
    description:
      "Provided strategic UX research and design leadership for enterprise software solutions. Specialized in AI-human interaction design patterns.",
    achievements: [
      "Conducted comprehensive UX audit for enterprise platform",
      "Developed AI interaction design guidelines",
      "Improved user task completion rate by 35%",
      "Created research methodology for AI product testing",
    ],
  },
  {
    company: "Nagarro",
    title: "Head of Design",
    period: "2020 - 2022",
    description:
      "Built and led global design organization across multiple markets. Established design operations and culture for 200+ person design team.",
    achievements: [
      "Scaled design team from 50 to 200+ designers globally",
      "Implemented design ops framework across 15+ countries",
      "Launched internal design system adopted by 100+ projects",
      "Mentored 800+ designers through training programs",
    ],
  },
];

const skills = [
  "AI Product Design",
  "Generative AI",
  "Design Systems",
  "Product Leadership",
  "UX Research",
  "Design Engineering",
  "React & Next.js",
  "TypeScript",
  "Design Operations",
  "Team Leadership",
  "Strategic Planning",
  "AI/ML Integration",
];

export default function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          About Randy Ellis
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
          AI Product Design Engineer bridging the gap between cutting-edge
          artificial intelligence and human-centered design. Passionate about
          creating products that amplify human potential through thoughtful AI
          integration.
        </p>
      </section>

      {/* Achievements */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Career Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <achievement.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {achievement.value}
                </div>
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {achievement.label}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {achievement.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Career Story */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Career Journey
        </h2>
        <div className="space-y-8">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            My journey in product design began with a fascination for how
            technology can solve real human problems. Over the past decade,
            I&apos;ve evolved from a traditional designer to an AI-powered
            product engineer, always maintaining focus on the human experience
            at the center of technological innovation.
          </p>

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The emergence of generative AI has fundamentally changed how I
            approach product design. Rather than replacing human creativity, I
            believe AI amplifies our ability to create more personalized,
            accessible, and impactful experiences. This philosophy drives my
            current work at Wealthberry Labs, where we&apos;re reimagining
            financial planning through AI-powered tools.
          </p>
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Professional Experience
        </h2>
        <div className="space-y-8">
          {experience.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-medium text-blue-600">
                        {role.company}
                      </span>
                      <ExternalLink className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                  <Badge variant="outline">{role.period}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-600 dark:text-zinc-400">
                  {role.description}
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Key Achievements:
                  </h4>
                  <ul className="space-y-1">
                    {role.achievements.map((achievement, achievementIndex) => (
                      <li
                        key={achievementIndex}
                        className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2"
                      >
                        <span className="text-blue-600 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Areas of Expertise
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Design Philosophy
        </h2>
        <Card>
          <CardContent className="pt-6">
            <blockquote className="text-lg italic text-zinc-600 dark:text-zinc-400 leading-relaxed">
              &quot;The best AI products don&apos;t feel like AI products—they
              feel like magic. They anticipate needs, remove friction, and
              amplify human capabilities without getting in the way. My goal is
              to create these magical experiences where technology serves
              humanity, not the other way around.&quot;
            </blockquote>
            <footer className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
              — Randy Ellis, on AI Product Design
            </footer>
          </CardContent>
        </Card>
      </section>

      {/* Contact CTA */}
      <section className="space-y-6 text-center py-8">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Let&apos;s Build Something Amazing
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Interested in collaborating on AI-powered products or discussing
          design leadership? I&apos;m always excited to connect with fellow
          innovators and explore new opportunities.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={`mailto:${getEmail()}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get in Touch
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
