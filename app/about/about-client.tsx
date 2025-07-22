"use client";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import {
  ExternalLink,
  Award,
  Users,
  TrendingUp,
  Lightbulb,
  ChevronUp,
} from "lucide-react";
import { getEmail } from "../data";

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
    companyUrl: "https://www.buildyourlegacywithai.com",
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
    companyUrl: "https://www.clockwork.com",
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
    companyUrl: "https://www.nagarro.com",
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

const adjunctExperience = [
  {
    company: "ThriveDX",
    companyUrl: "https://www.thrivedx.com",
    title: "Adjunct User Experience Instructor",
    period: "May 2021 - Nov 2022",
    description:
      "Conducted lectures, led discussions, and facilitated activities on product design principles, processes, and methodologies.",
    achievements: [
      "Conducted lectures, led discussions, and facilitated activities on product design principles, processes, and methodologies",
      "Developed and led workshops on effective writing techniques and provided personalized feedback to 20+ students, improving writing skills by 25% and increasing overall satisfaction by 30%",
      "Prepared, developed, and improved the program curriculum, assessment methods, and learning outcomes based on industry trends and feedback from students and employers",
    ],
  },
  {
    company: "General Assembly",
    companyUrl: "https://generalassemb.ly/instructors/randy-ellis/6528",
    title: "Lead Product Design Instructor",
    period: "Aug 2016 - Jul 2021",
    description:
      "Taught product design courses to a diverse group of students, ranging from beginners to advanced professionals, using instructional methods and technologies.",
    achievements: [
      "Taught product design courses to a diverse group of students, ranging from beginners to advanced professionals, using instructional methods and technologies",
      "Coached students on professional growth by conducting mock interviews, reviewing resumes, and providing constructive feedback; increased students' job offer acceptance rate by 25%",
      "Achieved a student success rate of 95%, as measured by student retention, completion, and job placement rates, in alignment with the program's target goals",
    ],
  },
];

const certifications = [
  {
    certName: "Trustworthy Generative AI",
    universityName: "Vanderbilt University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/3RRMXQI3TCS6",
  },
  {
    certName: "Prompt Engineering for ChatGPT",
    universityName: "Vanderbilt University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/7WUUQR5PZTDH",
  },
  {
    certName: "IT Fundamentals and Hardware Essentials",
    universityName: "Packt",
    certDateIssued: "May 3, 2025",
    validationLink: "https://coursera.org/verify/9P0T7VC491X3",
  },
  {
    certName: "Google AI Essentials",
    universityName: "Google",
    certDateIssued: "May 3, 2025",
    validationLink: "https://coursera.org/verify/9SOF12H0WADL",
  },
  {
    certName: "Networking, Peripherals, and Wireless Technologies",
    universityName: "Packt",
    certDateIssued: "May 3, 2025",
    validationLink: "https://coursera.org/verify/ES7ZOJPUOV2Y",
  },
  {
    certName: "Leadership Through Social Influence",
    universityName: "Northwestern University",
    certDateIssued: "Apr 29, 2025",
    validationLink: "https://coursera.org/verify/FKU8HG762FLM",
  },
  {
    certName:
      "High Performance Collaboration: Leadership, Teamwork, and Negotiation",
    universityName: "Northwestern University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/KUI8G4DFK7MG",
  },
  {
    certName: "Advanced Networking, Virtualization, and IT Security",
    universityName: "Packt",
    certDateIssued: "May 3, 2025",
    validationLink: "https://coursera.org/verify/PMV565AL0DG9",
  },
  {
    certName: "Generative AI Leadership & Strategy",
    universityName: "Vanderbilt University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/specialization/QPBSTXZDMMN8",
  },
  {
    certName: "CompTIA A+ Certification Core 1 (220-1101)",
    universityName: "Packt",
    certDateIssued: "May 3, 2025",
    validationLink: "https://coursera.org/verify/specialization/VOCCSPV5YLZH",
  },
  {
    certName: "Leadership Through Marketing",
    universityName: "Northwestern University",
    certDateIssued: "Apr 29, 2025",
    validationLink: "https://coursera.org/verify/VPIM3205T6GU",
  },
  {
    certName: "Leadership Communication for Maximum Impact: Storytelling",
    universityName: "Northwestern University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/WUY725TPQC1I",
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

function CertificationsAccordion() {
  return (
    <Accordion
      className="flex w-full flex-col divide-y divide-zinc-200 dark:divide-zinc-700"
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {certifications.map((cert, index) => (
        <AccordionItem key={index} value={`cert-${index}`} className="py-2">
          <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center justify-between">
              <div>{cert.certName}</div>
              <ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-600">
                  {cert.universityName}
                </span>
                <Badge variant="outline">
                  {new Date(cert.certDateIssued).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              </div>
              <a
                href={cert.validationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
              >
                Verify Certificate
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function AboutClient() {
  return (
    <motion.main
      className="space-y-16"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          About Randy Ellis
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
          AI Product Design Engineer bridging the gap between cutting-edge
          artificial intelligence and human-centered design. Passionate about
          creating products that amplify human potential through thoughtful AI
          integration.
        </p>
      </motion.section>

      {/* Achievements */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
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
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex justify-center">
                  <span className="whitespace-nowrap">{achievement.label}</span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {achievement.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <Separator />

      {/* Career Story */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
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
      </motion.section>

      {/* Experience */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
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
                      <a
                        href={role.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        {role.company}
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
      </motion.section>

      <Separator />

      {/* Adjunct Instructor Experience */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Adjunct Instructor Experience
        </h2>
        <div className="space-y-8">
          {adjunctExperience.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={role.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        {role.company}
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
      </motion.section>

      <Separator />

      {/* Certifications */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Certifications
        </h2>
        <CertificationsAccordion />
      </motion.section>

      {/* Skills */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
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
      </motion.section>

      {/* Philosophy */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
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
      </motion.section>

      {/* Contact CTA */}
      <motion.section
        className="space-y-6 text-center py-8"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
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
      </motion.section>
    </motion.main>
  );
}
