import { ReactNode } from "react";
import { CaseStudyHero } from "./case-study-hero";
import { CaseStudySection } from "./case-study-section";
import { MetricsCard } from "./metrics-card";
import { ImageGallery } from "./image-gallery";
import { VideoPlayer } from "./video-player";
import { Separator } from "@/components/ui/separator";

export interface CaseStudyData {
  title: string;
  client: string;
  partner: string;
  timeline: string;
  platforms: string[];
  hero: {
    title: string;
    subtitle: string;
    client: string;
    partner: string;
    timeline: string;
    platforms: string[];
    heroImage: string;
    heroVideo?: string;
  };
  metrics: Array<{
    label: string;
    value: string;
    description: string;
  }>;
}

interface CaseStudyLayoutProps {
  data: CaseStudyData;
  children?: ReactNode;
}

export function CaseStudyLayout({ data }: CaseStudyLayoutProps) {
  const researchImages = [
    {
      src: "/projects/echo/research1.jpg",
      alt: "Field research with drivers",
      caption: "On-site driver interviews",
    },
    {
      src: "/projects/echo/research2.jpg",
      alt: "Dispatch team research",
      caption: "Dispatch workflow analysis",
    },
    {
      src: "/projects/echo/discovery1.png",
      alt: "Discovery workshops",
      caption: "Stakeholder workshops",
    },
    {
      src: "/projects/echo/discovery2.jpg",
      alt: "Journey mapping",
      caption: "User journey mapping",
    },
    {
      src: "/projects/echo/discovery3.jpg",
      alt: "Pain point analysis",
      caption: "Pain point identification",
    },
  ];

  const brandImages = [
    {
      src: "/projects/echo/brand1.jpg",
      alt: "Brand strategy development",
      caption: "Brand strategy workshops",
    },
    {
      src: "/projects/echo/brand2.jpg",
      alt: "Logo design process",
      caption: "Logo design iterations",
    },
    {
      src: "/projects/echo/brand3.png",
      alt: "Brand guidelines",
      caption: "EchoDrive brand guidelines",
    },
  ];

  const developmentImages = [
    {
      src: "/projects/echo/dev1.jpg",
      alt: "Mobile app development",
      caption: "iOS & Android development",
    },
    {
      src: "/projects/echo/dev2.jpg",
      alt: "Web platform development",
      caption: "Dispatch web platform",
    },
    {
      src: "/projects/echo/showcase1.jpg",
      alt: "Final product showcase",
      caption: "EchoDrive mobile app",
    },
    {
      src: "/projects/echo/showcase2.jpg",
      alt: "Platform integration",
      caption: "Cross-platform integration",
    },
  ];

  return (
    <main className="min-h-screen w-full">
      <div className="w-full">
        {/* Hero Section */}
        <CaseStudyHero {...data.hero} />

        <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
          {/* Project Overview */}
          <CaseStudySection title="Project Overview" id="overview">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-xl leading-relaxed">
                Echo Global Logistics, headquartered in Chicago, is a prominent
                provider of technology-enabled transportation and supply chain
                management services. With over 30 offices nationwide and a
                network of 40,000+ transportation providers, Echo needed a
                modern solution to replace outdated coordination methods between
                shippers, drivers, and dispatch teams.
              </p>
            </div>
          </CaseStudySection>

          <Separator />

          {/* The Challenge */}
          <CaseStudySection title="The Challenge" id="challenge">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold">
                  Primary Objectives
                </h3>
                <ul className="text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <strong>ELD Mandate Compliance</strong> - Meet Electronic
                      Logging Device requirements through digital logging
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <strong>Visibility Enhancement</strong> - Reduce
                      call-center stress through improved truckload tracking
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <strong>Revenue Growth</strong> - Increase LTL shipment
                      revenues through self-serve booking
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <strong>Driver Engagement</strong> - Boost driver
                      participation and app adoption
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold">
                  Industry Pain Points
                </h3>
                <ul className="text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">×</span>
                    <span>Fragmented communication between stakeholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">×</span>
                    <span>Manual processes causing delays and errors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">×</span>
                    <span>Limited shipment visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">×</span>
                    <span>Compliance challenges with new regulations</span>
                  </li>
                </ul>
              </div>
            </div>
          </CaseStudySection>

          <Separator />

          {/* Research & Discovery */}
          <CaseStudySection title="Research & Discovery" id="research">
            <div className="space-y-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Eight Bit Studios conducted comprehensive user research to
                  understand real-world logistics challenges through stakeholder
                  interviews, on-site field research, and comprehensive user
                  journey mapping.
                </p>
              </div>
              <ImageGallery images={researchImages} />
            </div>
          </CaseStudySection>

          <Separator />

          {/* Brand & Strategy Development */}
          <CaseStudySection title="Brand & Strategy Development" id="brand">
            <div className="space-y-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Eight Bit Studios developed a cohesive brand strategy that
                  aligned with Echo&apos;s ethos while establishing EchoDrive as
                  a distinct digital product in the logistics space, including
                  functional logo design and comprehensive brand guidelines.
                </p>
              </div>
              <ImageGallery images={brandImages} />
            </div>
          </CaseStudySection>

          <Separator />

          {/* Solution Architecture */}
          <CaseStudySection title="Solution Architecture" id="solution">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h3 className="mb-6 text-xl font-semibold">
                  Mobile Applications (iOS & Android)
                </h3>
                <ul className="text-muted-foreground space-y-3">
                  <li>Native mobile apps for drivers</li>
                  <li>Electronic logging capabilities</li>
                  <li>Real-time shipment tracking</li>
                  <li>Communication tools</li>
                </ul>

                <h4 className="mt-8 mb-4 text-lg font-semibold">
                  Core Features
                </h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <strong>Login & Profiles</strong> - Secure authentication
                  </li>
                  <li>
                    <strong>Electronic Logging</strong> - ELD mandate compliance
                  </li>
                  <li>
                    <strong>Shipment Tracking</strong> - Real-time updates
                  </li>
                  <li>
                    <strong>Communication Platform</strong> - Direct dispatch
                    messaging
                  </li>
                  <li>
                    <strong>Issue Reporting</strong> - Problem escalation
                  </li>
                  <li>
                    <strong>Invoice & Payment Tracking</strong> - Financial
                    management
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6 text-xl font-semibold">Web Application</h3>
                <ul className="text-muted-foreground space-y-3">
                  <li>Internal tools for dispatch teams</li>
                  <li>Customer service representative interface</li>
                  <li>Seamless integration with mobile platform</li>
                </ul>

                <h4 className="mt-8 mb-4 text-lg font-semibold">
                  Platform Features
                </h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <strong>Fleet Management</strong> - Active driver overview
                  </li>
                  <li>
                    <strong>Route Optimization</strong> - Delivery planning
                  </li>
                  <li>
                    <strong>Communication Hub</strong> - Centralized messaging
                  </li>
                  <li>
                    <strong>Analytics Dashboard</strong> - Performance insights
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <VideoPlayer
                src="/projects/echo/echodrive-mockup-video.mp4"
                poster="/projects/echo/poster.png"
                title="EchoDrive Platform Demonstration"
              />
            </div>
          </CaseStudySection>

          <Separator />

          {/* Results & Impact */}
          <CaseStudySection title="Results & Impact" id="results">
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {data.metrics.map((metric, index) => (
                <MetricsCard key={index} metric={metric} />
              ))}
            </div>

            <div className="grid gap-8 text-center md:grid-cols-3">
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Compliance Achievement
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>✅ Met ELD Mandate requirements</li>
                  <li>✅ Electronic logging implementation</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Process Enhancement
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>Streamlined internal operations</li>
                  <li>Enhanced driver-dispatcher communication</li>
                  <li>Strengthened digital transformation</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold">Growth Metrics</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>Substantial year-over-year growth</li>
                  <li>Alpha → Beta → Launch success</li>
                  <li>Industry standard establishment</li>
                </ul>
              </div>
            </div>
          </CaseStudySection>

          <Separator />

          {/* Development Process */}
          <CaseStudySection
            title="Development & Implementation"
            id="development"
          >
            <div className="space-y-8">
              <div className="grid gap-6 text-center md:grid-cols-4">
                <div className="rounded-lg border p-6">
                  <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full">
                    1
                  </div>
                  <h4 className="mb-2 font-semibold">Discovery</h4>
                  <p className="text-muted-foreground text-sm">
                    Stakeholder workshops & research
                  </p>
                </div>
                <div className="rounded-lg border p-6">
                  <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full">
                    2
                  </div>
                  <h4 className="mb-2 font-semibold">Design</h4>
                  <p className="text-muted-foreground text-sm">
                    Brand & UI/UX development
                  </p>
                </div>
                <div className="rounded-lg border p-6">
                  <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full">
                    3
                  </div>
                  <h4 className="mb-2 font-semibold">Development</h4>
                  <p className="text-muted-foreground text-sm">
                    Native & web app creation
                  </p>
                </div>
                <div className="rounded-lg border p-6">
                  <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full">
                    4
                  </div>
                  <h4 className="mb-2 font-semibold">Launch</h4>
                  <p className="text-muted-foreground text-sm">
                    Beta testing & optimization
                  </p>
                </div>
              </div>

              <ImageGallery images={developmentImages} />
            </div>
          </CaseStudySection>

          <Separator />

          {/* Lessons Learned */}
          <CaseStudySection title="Lessons Learned" id="lessons">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Research-First Approach
                  </h3>
                  <p className="text-muted-foreground">
                    The success of EchoDrive demonstrated the critical
                    importance of field research and direct user observation.
                    Understanding real-world workflows enabled the team to
                    design solutions that truly addressed user needs.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Cross-Platform Consistency
                  </h3>
                  <p className="text-muted-foreground">
                    Maintaining feature parity and visual consistency across
                    mobile and web platforms ensured seamless user experience
                    transitions between different interaction contexts.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Stakeholder Alignment
                  </h3>
                  <p className="text-muted-foreground">
                    Regular stakeholder engagement throughout the development
                    process ensured the final product met business objectives
                    while serving end-user needs effectively.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Scalability Planning
                  </h3>
                  <p className="text-muted-foreground">
                    Designing for growth from the outset enabled EchoDrive to
                    successfully scale from beta testing to supporting over
                    10,000 active users without architectural changes.
                  </p>
                </div>
              </div>
            </div>
          </CaseStudySection>

          <Separator />

          {/* Project Impact */}
          <CaseStudySection title="Project Impact" id="impact">
            <div className="mx-auto max-w-4xl space-y-6 text-center">
              <p className="text-xl leading-relaxed">
                EchoDrive represents a successful digital transformation in the
                logistics industry, demonstrating how user-centered design and
                modern technology can revolutionize traditional workflows.
              </p>
              <p className="text-muted-foreground">
                The project&apos;s success in achieving compliance requirements
                while dramatically improving operational metrics established a
                new standard for logistics technology solutions. The
                collaboration between Echo Global Logistics and Eight Bit
                Studios showcases the power of combining domain expertise with
                digital innovation to create solutions that drive measurable
                business outcomes.
              </p>
            </div>
          </CaseStudySection>
        </div>
      </div>
    </main>
  );
}
