"use client";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
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
  GraduationCap,
} from "lucide-react";
import { getEmail } from "../data";
import AvatarCircularText from "@/components/ui/avatar-circular-text";

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
      "Lead product vision and manage teams for fintech platform aiding underserved communities",
      "Achieved 22% weekly retention and 18% conversion from signups to paid waitlist in closed beta",
      "Conducted 50+ UX sessions, gathering 900+ feedback events to refine product features",
      "Enhanced onboarding via A/B tests, boosting task completion by 34% and halving time",
    ],
  },
  {
    company: "Clockwork",
    companyUrl: "https://www.clockwork.com",
    title: "Lead UX Researcher",
    period: "2023",
    description:
      "Provided strategic UX research and design leadership for financial client non-profit programs. Specialized in financial planning tools and inventory management optimization.",
    achievements: [
      "Produced mid-fidelity wireframes and user journey flows for a financial client to reduce onboarding time for their non-profit financial literacy banking program by 12%",
      "Interviewed more than 30 internal financial planners and advocates to analyze the user experience and enhance their financial planning tools",
      "Conducted internal user interviews to recommend a best-in-class PIM solution, resulting in a 23% reduction in inventory management bottlenecks",
    ],
  },
  {
    company: "Nagarro",
    companyUrl: "https://www.nagarro.com",
    title: "Head of Design",
    period: "2020 - 2022",
    promotion: true,
    description:
      "Orchestrated the IT firm's design evangelism strategy roadmap, aligning with the firm's vision and goals while building global design organization.",
    achievements: [
      "Orchestrated the IT firm's design evangelism strategy roadmap, aligning with the firm's vision and goals; grew brand recognition by 50% and generated 100+ leads via design events and webinars",
      "Facilitated 1:1 coaching sessions with 15+ junior-senior level designers to enhance user-centered design skills, resulting in a 100% positive impact from team members and a 40% increase in junior designer retention rate",
      "Produced and disseminated 15+ leadership articles on industry trends and design best practices to 10k+ subscribers; drove a 40% improvement in website traffic and a 25% boost in lead generation",
    ],
  },
  {
    company: "Nagarro DV",
    companyUrl: "https://www.nagarro.com",
    title: "Director of DesignOps",
    period: "Feb 2020 - Mar 2022",
    description:
      "Guided a design ops strategy that streamlined design processes and collaboration across teams. Collaborated with product and engineering teams to establish design and development roadmaps.",
    achievements: [
      "Guided a design ops strategy that streamlined design processes and collaboration across teams, dropping design cycle time by 35% and growing design quality by 40%",
      "Collaborated with product and engineering teams to establish design and development roadmap; ensured continuous feedback and alignment between design and development phases, reduced design and development time by 30%",
      "Defined weekly design reviews with cross-functional teams and provided in-depth feedback on design quality and adherence to design principles, with product usability up by 23% and customer satisfaction by 38%",
    ],
  },
  {
    company: "Alight Solutions",
    companyUrl: "https://www.alight.com",
    title: "Associate Director of UX/Product Design",
    period: "Sep 2018 - Jul 2019",
    description:
      "Led product launch for AI anomaly payroll detection system and supervised team to launch analytics-focused career-tracking mobile app. Conducted comprehensive user research through multiple methodologies.",
    achievements: [
      "Guided product launch for an AI anomaly payroll detection system for the internal accounting team that improved the detection of errors by 60%. Leading to B2B white-label solutions for resale opportunities",
      "Authored and managed UX design documentation, including wireframes, prototypes, interaction models, and design guidelines",
      "Conducted user research through surveys, heat maps, and A/B testing, improving user engagement by 50% and a drop in bounce rates by 25% with the innovation lab products",
      "Supervised a team of junior designers/developers to launch an analytics-focused career-tracking mobile app for the platform audience. Improving customer success of job placement by 35%",
    ],
  },
  {
    company: "DigitasLBi",
    companyUrl: "https://www.digitas.com/en-us/offices/chicago",
    title: "Lead Product Designer",
    period: "Jul 2018 - Sep 2019",
    description:
      "Prepared UX deliverables and planned collaboration with visual designers to align UI design with overall UX strategy, usability standards, and accessibility guidelines.",
    achievements: [
      "Prepared UX deliverables, such as wireframes, prototypes, user flows, and interactive mockups that communicated design concepts and interactions to clients and team members",
      "Planned collaboration with visual designers to align UI design with overall UX strategy, usability standards, accessibility guidelines, and brand requirements, growing website engagement by 25%",
    ],
  },
  {
    company: "Eight Bit Studios",
    companyUrl: "https://eightbitstudios.com",
    title: "User Experience Strategist",
    period: "Mar 2016 - Jun 2018",
    description:
      "Designed and executed mobile app usability testing using comprehensive metrics. Analyzed user behavior data and feedback to optimize essential user journeys.",
    achievements: [
      "Designed and executed mobile app usability testing using metrics, including task completion rate and user satisfaction rating; identified and resolved 50+ usability issues and increased user retention by 15%",
      "Analyzed user behavior data and feedback via heatmaps, surveys, and interviews; used insights to optimize seven essential user journeys, lowering drop-off rates by 25%",
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
    colleges: [
      "University of Wisconsin",
      "Institute of Technology of New Jersey",
      "University of Miami",
      "University of Kansas",
    ],
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
    certName:
      "High Performance Collaboration: Leadership, Teamwork, and Negotiation",
    universityName: "Northwestern University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/KUI8G4DFK7MG",
  },
  {
    certName: "Generative AI Leadership & Strategy",
    universityName: "Vanderbilt University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/specialization/QPBSTXZDMMN8",
  },
  {
    certName: "Leadership Communication for Maximum Impact: Storytelling",
    universityName: "Northwestern University",
    certDateIssued: "Apr 28, 2025",
    validationLink: "https://coursera.org/verify/WUY725TPQC1I",
  },
  {
    certName: "Leadership Through Social Influence",
    universityName: "Northwestern University",
    certDateIssued: "Apr 29, 2025",
    validationLink: "https://coursera.org/verify/FKU8HG762FLM",
  },
  {
    certName: "Leadership Through Marketing",
    universityName: "Northwestern University",
    certDateIssued: "Apr 29, 2025",
    validationLink: "https://coursera.org/verify/VPIM3205T6GU",
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
    certName: "Advanced Networking, Virtualization, and IT Security",
    universityName: "Packt",
    certDateIssued: "May 3, 2025",
    validationLink: "https://coursera.org/verify/PMV565AL0DG9",
  },
  {
    certName: "CompTIA A+ Certification Core 1 (220-1101)",
    universityName: "Packt",
    certDateIssued: "May 3, 2025",
    validationLink: "https://coursera.org/verify/specialization/VOCCSPV5YLZH",
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
      transition={{ duration: 0.2 }}
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
                className="inline-flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
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
      className="space-y-12 sm:space-y-16"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section
        className="space-y-8"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        {/* Avatar with Circular Text */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          <motion.div
            className="mb-8 flex justify-center md:mb-0 md:justify-start"
            variants={VARIANTS_SECTION}
            transition={{ ...TRANSITION_SECTION, delay: 0.1 }}
          >
            <AvatarCircularText />
          </motion.div>

          <div className="flex-1 space-y-6">
            <h1 className="text-center text-4xl font-bold text-zinc-900 md:text-left dark:text-zinc-100">
              Randy Ellis
            </h1>
            <p className="text-center text-xl leading-relaxed text-zinc-600 md:text-left dark:text-zinc-400">
              AI Product Design Engineer bridging the gap between cutting-edge
              artificial intelligence and human-centered design. Passionate
              about creating products that amplify human potential through
              thoughtful AI integration.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Achievements */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Career Impact
        </ScrambleSectionTitle>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <achievement.icon className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                <div className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {achievement.value}
                </div>
                <div className="mb-1 flex justify-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Career Journey
        </ScrambleSectionTitle>
        <div className="space-y-8">
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
            My journey in product design began with a fascination for how
            technology can solve real human problems. Over the past decade,
            I&apos;ve evolved from a traditional designer to an AI-powered
            product engineer, always maintaining focus on the human experience
            at the center of technological innovation.
          </p>

          <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
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
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Professional Experience
        </ScrambleSectionTitle>
        <div className="space-y-8">
          {experience.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{role.title}</CardTitle>
                      {role.promotion && (
                        <Badge
                          variant="secondary"
                          className="border-yellow-200 bg-yellow-100 text-xs text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        >
                          ⭐ Promotion
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <a
                        href={role.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700"
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
                        className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="mt-1 text-blue-600">•</span>
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
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Adjunct Instructor Experience
        </ScrambleSectionTitle>
        <div className="space-y-8">
          {adjunctExperience.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <a
                        href={role.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700"
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
                {role.colleges && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      <GraduationCap className="h-4 w-4" />
                      Partner Universities:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.colleges.map((college, collegeIndex) => (
                        <Badge
                          key={collegeIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {college}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Key Achievements:
                  </h4>
                  <ul className="space-y-1">
                    {role.achievements.map((achievement, achievementIndex) => (
                      <li
                        key={achievementIndex}
                        className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="mt-1 text-blue-600">•</span>
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
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Certifications
        </ScrambleSectionTitle>
        <CertificationsAccordion />
      </motion.section>

      {/* Skills */}
      <motion.section
        className="space-y-6"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Areas of Expertise
        </ScrambleSectionTitle>
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
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Design Philosophy
        </ScrambleSectionTitle>
        <Card>
          <CardContent className="pt-6">
            <blockquote className="text-lg leading-relaxed text-zinc-600 italic dark:text-zinc-400">
              &quot;The best AI products don&apos;t feel like AI products—they
              feel like magic. They anticipate needs, remove friction, and
              amplify human capabilities without getting in the way. My goal is
              to create these magical experiences where technology serves
              humanity, not the other way around.&quot;
            </blockquote>
            <footer className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              — Randy Ellis, on AI Product Design
            </footer>
          </CardContent>
        </Card>
      </motion.section>

      {/* Contact CTA */}
      <motion.section
        className="space-y-6 py-8 text-center"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <ScrambleSectionTitle
          as="h2"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Let&apos;s Build Something Amazing
        </ScrambleSectionTitle>
        <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
          Interested in collaborating on AI-powered products or discussing
          design leadership? I&apos;m always excited to connect with fellow
          innovators and explore new opportunities.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={`mailto:${getEmail()}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Get in Touch
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </motion.section>
    </motion.main>
  );
}
