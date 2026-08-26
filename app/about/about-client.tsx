"use client";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  SectionLabel,
  SECTION,
  ROW,
} from "@/components/case-study/section-chrome";
import { CaseStudyTOC } from "@/components/case-study/case-study-toc";
import AvatarCircularText from "@/components/ui/avatar-circular-text";
import { testimonials } from "@/lib/data/testimonials";
import { CTASection } from "@/components/ui/cta-section";

/**
 * The proof exhibits. No icons: the Proof Exhibit signature is a figure over a
 * context line, and a decorative glyph above each one adds nothing the number
 * does not already say.
 *
 * The named awards live on the entry whose figure counts them, so the array's
 * length and the rendered `4` cannot drift apart — that drift is exactly what
 * `__tests__/seo/award-count-consistency.test.ts` exists to catch. They are
 * rendered by the Recognition section below the band, not inside this cell: a
 * quarter-width column at `text-xs` turned four issuer-and-category strings
 * into a 286px ribbon beside three 55px siblings.
 */
const achievements: ReadonlyArray<{
  value: string;
  label: string;
  description: string;
  awards?: readonly string[];
  judgeCredential?: string;
}> = [
  {
    value: "500M+",
    label: "Users impacted",
    description: "Across multiple products and platforms",
  },
  {
    value: "4",
    label: "Design awards",
    description: "Recognition for innovative design work",
    awards: [
      "Silver — The Davey Awards, Mobile Apps/Social",
      "Silver — The Davey Awards, Mobile Apps/Lifestyle",
      "3rd Place — Vega Digital Awards, Best User Interface App/Experience",
      "3rd Place — Vega Digital Awards, Best Lifestyle App",
    ],
    judgeCredential: "Also a Webby Awards judge.",
  },
  {
    value: "$500M+",
    label: "Product value",
    description: "Generated through strategic design decisions",
  },
  {
    value: "2000+",
    label: "Designers mentored",
    description: "Growing the next generation of design talent",
  },
];

/**
 * The Recognition section reads the named awards off the proof exhibit whose
 * figure counts them, rather than holding a second copy. Two hand-authored
 * lists of the same claim is how the OG image came to say `6` while three
 * other surfaces said 4.
 */
const recognition = achievements.find((achievement) => achievement.awards);

/**
 * What each aggregate figure is actually made of.
 *
 * The proof band states four totals; on their own, a total that large invites
 * the reader to assume solo credit, which is the one thing it does not mean.
 * This names the organizations the work sat inside and what each contributes,
 * so the arithmetic is checkable rather than asserted. It is also the part of
 * the page an answer engine can quote when asked how the numbers hold up.
 */
const careerScale: ReadonlyArray<{
  org: string;
  scope: string;
  backs: string;
}> = [
  {
    org: "DigitasLBi",
    scope: "Global digital agency · 1000+ designers · Fortune 500 roster",
    backs:
      "Major brand accounts reaching 100–300M+ people per campaign cycle, inside a 1000+ designer organization.",
  },
  {
    org: "Leo Burnett",
    scope: "Global creative agency · 500+ designers",
    backs:
      "Mass-market campaigns with global reach, inside a 500+ person creative organization.",
  },
  {
    org: "Alight",
    scope: "Benefits and HR technology · millions of employees served",
    backs:
      "Enterprise platforms used by millions of workers across major corporations.",
  },
  {
    org: "Nagarro",
    scope: "500+ person consultancy · Director of DesignOps",
    backs:
      "Enterprise engagements at $10–50M contract value; design operations across a 200+ designer population.",
  },
  {
    org: "Chameleon Collective",
    scope: "Fractional design leadership · multiple client organizations",
    backs: "Design leadership across 20–50 designers on client teams.",
  },
  {
    org: "Wealthberry Labs",
    scope: "Founder · AI-native hiring compliance",
    backs: "Current work, where the prior two decades get applied.",
  },
];

const experience = [
  {
    company: "Chameleon Collective",
    companyUrl: "https://chameleoncollective.com",
    title: "Fractional VP, Design",
    period: "Oct 2022 - Present",
    description:
      "Fractional design leadership for venture-backed startups and established brands — design strategy, scalable design systems, and remote team leadership.",
    achievements: [
      "Partner with startups and brands as an embedded fractional design executive",
      "Drive end-to-end product design, design strategy, and design-system scale",
    ],
  },
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

// Visible At Zero Rule: entrance motion moves, it never hides. The hidden
// state stays fully opaque (and carries no blur) so the content is painted
// before any observer fires; only the y-offset settles on reveal.
const VARIANTS_CONTAINER = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 1, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

/** Named once, so each heading and the contents line cannot drift apart. */
const SECTIONS = [
  { id: "impact", label: "Career impact" },
  { id: "scale", label: "How the numbers add up" },
  { id: "recognition", label: "Recognition" },
  { id: "journey", label: "Career journey" },
  { id: "experience", label: "Professional experience" },
  { id: "teaching", label: "Adjunct instructor experience" },
  { id: "certifications", label: "Certifications" },
  { id: "expertise", label: "Areas of expertise" },
  { id: "philosophy", label: "Design philosophy" },
  { id: "colleagues", label: "What colleagues say" },
];

const labelFor = (id: string) =>
  SECTIONS.find((section) => section.id === id)?.label ?? id;

type Role = {
  company: string;
  companyUrl: string;
  title: string;
  period: string;
  description: string;
  achievements: string[];
  colleges?: string[];
  promotion?: boolean;
};

/**
 * A link that leaves the site says so twice: an arrow for the eye and an
 * `sr-only` note for everyone else. The negative margin buys a 44px target
 * without loosening the row it sits in.
 */
function OutboundLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="-my-3 inline-flex w-fit items-start gap-1.5 py-3 text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/**
 * One role as a ledger row rather than a card: the employer and dates are the
 * subordinate column, the role itself is the assertion and carries the weight.
 */
function RoleRow({ role }: { role: Role }) {
  return (
    <div className={ROW}>
      <div className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
        <OutboundLink href={role.companyUrl}>{role.company}</OutboundLink>
        <span className="mt-1 block tabular-nums">{role.period}</span>
        {role.promotion && <span className="mt-1 block">Promotion</span>}
      </div>
      <div className="mt-2 sm:mt-0">
        <p className="text-base font-medium text-zinc-900 dark:text-white">
          {role.title}
        </p>
        <p className="mt-2 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
          {role.description}
        </p>
        {role.colleges && (
          <p className="mt-3 max-w-[62ch] text-sm text-zinc-500 dark:text-zinc-400">
            Taught through {role.colleges.join(" · ")}
          </p>
        )}
        <ul className="mt-3 max-w-[62ch]">
          {role.achievements.map((achievement) => (
            <li
              key={achievement}
              className="border-t border-zinc-200 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
            >
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Someone else's words: attribution subordinate, the quote itself in Ink. */
function QuoteRow({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <figure className={ROW}>
      <figcaption className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
        <span className="block text-zinc-900 dark:text-white">{author}</span>
        {role}
      </figcaption>
      <blockquote className="mt-2 max-w-[68ch] text-base font-medium text-zinc-900 sm:mt-0 dark:text-white">
        {`“${quote}”`}
      </blockquote>
    </figure>
  );
}

export default function AboutClient() {
  return (
    <motion.main
      id="main-content"
      // The browser's own surfaces carry the design too: selection and caret
      // are themed from the palette rather than left on their defaults.
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
          <AvatarCircularText />
          <div>
            <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
              Randy Ellis
            </h1>
            <p className="mt-5 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-300">
              AI Product Design Engineer bridging the gap between cutting-edge
              artificial intelligence and human-centered design. Passionate
              about creating products that amplify human potential through
              thoughtful AI integration.
            </p>
          </div>
        </div>

        {/* Eight sections, well past the six the contents line is for. */}
        <div className="mt-10">
          <CaseStudyTOC items={SECTIONS} sectionId="about-toc" />
        </div>
      </motion.section>

      <motion.section
        id="impact"
        aria-labelledby="impact-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="impact-heading">{labelFor("impact")}</SectionLabel>
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
          {achievements.map((achievement) => (
            <div key={achievement.label} className="flex flex-col">
              <dd className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900 tabular-nums sm:text-4xl dark:text-white">
                {achievement.value}
              </dd>
              <dt className="mt-3 text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                {achievement.label}
                {/* Each figure's context differs, so it stays with its figure
                    rather than collapsing into one shared qualifier. */}
                <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  {achievement.description}
                </span>
              </dt>
            </div>
          ))}
        </dl>
      </motion.section>

      <motion.section
        id="scale"
        aria-labelledby="scale-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="scale-heading">{labelFor("scale")}</SectionLabel>
        <p className="mt-6 max-w-[70ch] text-base text-zinc-600 dark:text-zinc-300">
          Every figure above is a career-to-date aggregate across the
          organizations below — the scale the work sat inside, not solo credit.
        </p>
        <ul className="mt-4">
          {careerScale.map((entry) => (
            <li
              key={entry.org}
              className="border-t border-zinc-200 py-4 dark:border-zinc-800"
            >
              <p className="text-base text-zinc-900 dark:text-white">
                {entry.org}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {entry.scope}
              </p>
              <p className="mt-2 max-w-[70ch] text-base text-zinc-600 dark:text-zinc-300">
                {entry.backs}
              </p>
            </li>
          ))}
        </ul>
        {/* The qualifier the totals cannot carry themselves, in the same
            subordinate tone the Webby credential uses below. */}
        <p className="max-w-[70ch] border-t border-zinc-200 py-4 text-base text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          500M+ is the addressable audience of the products and campaigns the
          work shaped, not unique users. 2000+ counts designers mentored,
          influenced, and collaborated with across these organizations, not
          direct reports.
        </p>
      </motion.section>

      {recognition?.awards && (
        <motion.section
          id="recognition"
          aria-labelledby="recognition-heading"
          className={SECTION}
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <SectionLabel id="recognition-heading">
            {labelFor("recognition")}
          </SectionLabel>
          {/* Full-width hairline rows, not the proof band's quarter-width cell.
              Four placement-issuer-category strings at `text-xs` in a 132px
              column wrapped to three lines each; here they get the line length
              they need. */}
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-300">
            All four for GrowIt!
          </p>
          <ul className="mt-4">
            {recognition.awards.map((award) => (
              <li
                key={award}
                className="border-t border-zinc-200 py-4 text-base text-zinc-900 dark:border-zinc-800 dark:text-white"
              >
                {award}
              </li>
            ))}
          </ul>
          {/* The Webby is a judging credential, never a win and never counted
              among the four — so it sits outside the list, in the subordinate
              tone the other three proof-band qualifiers use. */}
          {recognition.judgeCredential && (
            <p className="border-t border-zinc-200 py-4 text-base text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {recognition.judgeCredential}
            </p>
          )}
        </motion.section>
      )}

      <motion.section
        id="journey"
        aria-labelledby="journey-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="journey-heading">{labelFor("journey")}</SectionLabel>
        <div className="mt-6 space-y-5">
          <p className="max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
            My journey in product design began with a fascination for how
            technology can solve real human problems. Over the past decade,
            I&apos;ve evolved from a traditional designer to an AI-powered
            product engineer, always maintaining focus on the human experience
            at the center of technological innovation.
          </p>
          <p className="max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
            The emergence of generative AI has fundamentally changed how I
            approach product design. Rather than replacing human creativity, I
            believe AI amplifies our ability to create more personalized,
            accessible, and impactful experiences. This philosophy drives my
            current work at Wealthberry Labs, where we&apos;re reimagining
            financial planning through AI-powered tools.
          </p>
        </div>
      </motion.section>

      <motion.section
        id="experience"
        aria-labelledby="experience-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="experience-heading">
          {labelFor("experience")}
        </SectionLabel>
        <div className="mt-6">
          {experience.map((role) => (
            <RoleRow key={`${role.company}-${role.title}`} role={role} />
          ))}
        </div>
      </motion.section>

      <motion.section
        id="teaching"
        aria-labelledby="teaching-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="teaching-heading">
          {labelFor("teaching")}
        </SectionLabel>
        <div className="mt-6">
          {adjunctExperience.map((role) => (
            <RoleRow key={`${role.company}-${role.title}`} role={role} />
          ))}
        </div>
      </motion.section>

      <motion.section
        id="certifications"
        aria-labelledby="certifications-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="certifications-heading">
          {labelFor("certifications")}
        </SectionLabel>
        {/* Not a disclosure: the issuer, the date and the verification link are
            the parts a reader came for, so none of them hide behind a toggle. */}
        <dl className="mt-6">
          {certifications.map((cert) => (
            <div key={cert.validationLink} className={ROW}>
              <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                <span className="block text-zinc-900 dark:text-white">
                  {cert.universityName}
                </span>
                <span className="tabular-nums">
                  {new Date(cert.certDateIssued).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </dt>
              <dd className="mt-2 sm:mt-0">
                <p className="max-w-[62ch] text-base font-medium text-zinc-900 dark:text-white">
                  {cert.certName}
                </p>
                <div className="mt-1 text-sm">
                  <OutboundLink href={cert.validationLink}>
                    Verify certificate
                  </OutboundLink>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </motion.section>

      <motion.section
        id="expertise"
        aria-labelledby="expertise-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="expertise-heading">
          {labelFor("expertise")}
        </SectionLabel>
        {/* One set line rather than a dozen rounded pills — these are text, and
            text structures in this system are square or they are not boxes. */}
        <p className="mt-6 max-w-[62ch] text-base text-zinc-900 dark:text-white">
          {skills.join(" · ")}
        </p>
      </motion.section>

      <motion.section
        id="philosophy"
        aria-labelledby="philosophy-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="philosophy-heading">
          {labelFor("philosophy")}
        </SectionLabel>
        <div className="mt-6">
          <QuoteRow
            quote="The best AI products don’t feel like AI products—they feel like magic. They anticipate needs, remove friction, and amplify human capabilities without getting in the way. My goal is to create these magical experiences where technology serves humanity, not the other way around."
            author="Randy Ellis"
            role="On AI product design"
          />
        </div>
      </motion.section>

      <motion.section
        id="colleagues"
        aria-labelledby="colleagues-heading"
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SectionLabel id="colleagues-heading">
          {labelFor("colleagues")}
        </SectionLabel>
        <div className="mt-6">
          {testimonials.map((testimonial) => (
            <QuoteRow
              key={testimonial.author}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          LinkedIn recommendations, quoted in full and attributed.
        </p>
      </motion.section>

      <CTASection />
    </motion.main>
  );
}
