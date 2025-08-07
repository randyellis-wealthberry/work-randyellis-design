/**
 * TDD Test Suite: Nagarro Design Leadership Case Study - Data Validation Tests
 * 
 * This test suite validates the Nagarro project data structure, integrity,
 * and compatibility with the existing project data patterns following
 * the data-integrity.test.tsx approach.
 */

import type { Project, WorkExperience } from "@/lib/data/types";
import { WORK_EXPERIENCE } from "@/lib/data/static-data";

// Mock Nagarro project data structure (TDD - data model doesn't exist yet)
const mockNagarroProject: Project = {
  id: "nagarro-design-leadership",
  name: "Nagarro Design Leadership",
  subtitle: "Strategic Design Transformation at Global IT Consulting Firm",
  slug: "nagarro-design-leadership",
  description: "Led design strategy transformation at global IT consulting firm, boosting brand recognition by 50% and generating 100+ qualified leads through strategic design thinking, team development, and thought leadership initiatives.",
  longDescription: "As Head of Design at Nagarro, I spearheaded the company's design strategy transformation, establishing design thinking methodologies that elevated brand recognition by 50% in the competitive IT consulting market. The role encompassed coaching 15+ designers to enhance their strategic thinking capabilities, resulting in 40% improved team retention. Through thought leadership initiatives including 15+ published articles on design strategy and digital transformation, I increased website traffic by 40% and generated over 100 qualified leads. This case study demonstrates how strategic design leadership can transform organizational culture, improve business outcomes, and establish competitive differentiation in enterprise consulting services.",
  category: "Design Leadership",
  categories: ["Design Leadership", "Enterprise Strategy", "Team Development"],
  tags: [
    "Design Leadership",
    "Strategic Design",
    "IT Consulting",
    "Team Development",
    "Brand Strategy",
    "Content Strategy",
    "Thought Leadership",
    "Design Systems",
    "Enterprise UX",
    "Digital Transformation",
    "Design Coaching",
    "Lead Generation"
  ],
  link: "https://www.nagarro.com",
  video: "/projects/nagarro/nagarro-leadership-showcase.mp4",
  thumbnail: "/projects/nagarro/nagarro-hero-thumbnail.jpg",
  images: [
    "/projects/nagarro/nagarro-hero.jpg",
    "/projects/nagarro/design-strategy-framework.jpg",
    "/projects/nagarro/team-coaching-session.jpg",
    "/projects/nagarro/brand-recognition-metrics.jpg",
    "/projects/nagarro/thought-leadership-content.jpg",
    "/projects/nagarro/design-system-showcase.jpg"
  ],
  timeline: "Mar 2022 - Oct 2022",
  status: "completed",
  technologies: [
    "Design Strategy",
    "Figma",
    "Adobe Creative Suite",
    "Miro",
    "Notion",
    "Content Management",
    "Google Analytics",
    "A/B Testing",
    "Design Systems"
  ],
  featured: true,
  metrics: [
    { 
      label: "Brand Recognition Increase", 
      value: "50%", 
      description: "Improved market visibility through strategic design initiatives",
      performanceLevel: "excellent" as const
    },
    { 
      label: "Qualified Leads Generated", 
      value: "100+", 
      description: "Through strategic design and thought leadership content",
      performanceLevel: "excellent" as const
    },
    { 
      label: "Designer Skills Enhancement", 
      value: "15+", 
      description: "Coached design team members in strategic thinking",
      performanceLevel: "good" as const
    },
    { 
      label: "Team Retention Improvement", 
      value: "40%", 
      description: "Reduced designer turnover through coaching and development",
      performanceLevel: "good" as const
    },
    { 
      label: "Content Publications", 
      value: "15+", 
      description: "Articles on design strategy and digital transformation",
      performanceLevel: "excellent" as const
    },
    { 
      label: "Site Traffic Increase", 
      value: "40%", 
      description: "Through thought leadership and strategic content",
      performanceLevel: "good" as const
    }
  ],
  challenges: [
    "Establishing design thinking culture in traditional IT consulting environment",
    "Elevating design team capabilities from execution-focused to strategy-driven",
    "Creating measurable business impact through design leadership initiatives",
    "Building brand differentiation in highly competitive IT consulting market",
    "Scaling design influence across multiple client engagements simultaneously",
    "Transforming internal perception of design value from aesthetic to strategic"
  ],
  solutions: [
    "Implemented design strategy framework integrating business objectives with user-centered design principles",
    "Developed comprehensive coaching program for 15+ designers focusing on strategic thinking and business acumen",
    "Created thought leadership content strategy generating 100+ qualified leads through strategic design insights",
    "Established design system standards improving consistency and efficiency across client deliverables",
    "Built cross-functional collaboration processes elevating design input in strategic business decisions",
    "Launched internal design advocacy program demonstrating ROI of strategic design investments"
  ],
  learnings: [
    "Design leadership requires balancing creative vision with measurable business outcomes",
    "Coaching designers in business strategy significantly improves retention and career growth",
    "Thought leadership through content creation builds credibility and generates qualified leads",
    "Internal culture change is as important as external client-facing design improvements",
    "Strategic design frameworks must be adaptable across diverse client industries and challenges"
  ],
  teamSize: 15,
  role: "Head of Design & Strategic Lead",
  overview: {
    deliverables: [
      "Design Strategy Framework Development",
      "Team Coaching & Development Program (15+ designers)",
      "Brand Recognition Strategy Implementation",
      "Thought Leadership Content Strategy (15+ articles)",
      "Design System Standards & Guidelines",
      "Cross-Functional Collaboration Processes",
      "Lead Generation Strategy Through Design Excellence",
      "Internal Design Advocacy & Culture Change"
    ],
    teamMembers: [
      "Head of Design & Strategic Lead (Me)",
      "Senior UX Designers (5)",
      "Visual Designers (4)",
      "UI Designers (3)",
      "Design Researchers (2)",
      "Content Strategist",
      "Business Development Team (Collaboration)",
      "Marketing Team (Content Partnership)"
    ],
    timelineDuration: "8 months (Mar 2022 - Oct 2022)",
    toolsUsed: [
      "Figma (Design & Prototyping)",
      "Adobe Creative Suite (Brand Assets)",
      "Miro (Strategic Planning & Workshops)",
      "Notion (Documentation & Process)",
      "Google Analytics (Traffic & Lead Analysis)",
      "A/B Testing Tools (Content Optimization)",
      "Slack (Team Communication & Coaching)"
    ]
  },
  constraints: {
    technical: [
      "Integration with existing client technology stacks and constraints",
      "Scalable design systems supporting multiple concurrent client engagements",
      "Content management workflows for thought leadership publication",
      "Analytics and measurement tools for tracking design impact and ROI"
    ],
    environmental: [
      "Traditional IT consulting culture requiring gradual design thinking adoption",
      "Client expectations focused on technical delivery over design strategy",
      "Competitive market requiring differentiation through design excellence",
      "Remote team management during pandemic-influenced work arrangements"
    ],
    location: [
      "Global client base requiring design solutions adaptable across cultures",
      "Remote team coaching and development across multiple time zones",
      "Content strategy targeting international IT consulting market",
      "Brand visibility initiatives spanning European and North American markets"
    ]
  },
  processStory: {
    background: "Joining Nagarro as Head of Design presented a unique challenge: transforming a traditional IT consulting firm's approach to design from tactical execution to strategic business driver. The company possessed strong technical capabilities but lacked design thinking integration that could differentiate their services in an increasingly competitive market. With 15+ designers focused primarily on UI execution, the opportunity existed to elevate both individual capabilities and organizational design maturity to achieve measurable business impact.",
    approach: "My strategy centered on three pillars: 1) Design Strategy Framework - integrating user-centered design with business objectives, 2) Team Development - coaching designers in strategic thinking and business acumen, 3) Thought Leadership - establishing Nagarro's design expertise through strategic content. This approach required balancing immediate client delivery needs with long-term capability building, ensuring that strategic initiatives translated into measurable business outcomes including brand recognition, lead generation, and team retention.",
    methodology: "Implementation followed a phased approach: Month 1-2: Assessment of existing design capabilities and establishment of strategic framework. Month 3-4: Launch of comprehensive coaching program for 15+ designers focusing on strategic thinking development. Month 5-6: Content strategy execution producing 15+ articles on design strategy and digital transformation. Month 7-8: Measurement and optimization based on brand recognition metrics, lead generation data, and team retention improvements. Each phase included client feedback integration and iterative improvement of both processes and outcomes.",
    keyInsights: [
      "Strategic Design Impact: Design leadership effectiveness measured through business metrics (50% brand recognition increase, 100+ leads) rather than traditional design metrics alone",
      "Team Development ROI: Investing in designer strategic capabilities improved retention by 40% while enhancing client deliverable quality and strategic value",
      "Content-Driven Credibility: Thought leadership through strategic design content became primary differentiator, generating qualified leads and industry recognition",
      "Culture Change Management: Transforming design perception from aesthetic to strategic required consistent demonstration of business value and cross-functional collaboration"
    ],
    outcome: "The design leadership transformation achieved measurable success across multiple dimensions: 50% increase in brand recognition within the IT consulting market, generation of 100+ qualified leads through strategic design initiatives, 40% improvement in team retention through enhanced designer capabilities, and 40% increase in website traffic through thought leadership content. More importantly, the strategic framework established sustainable design influence across client engagements, with design considerations integrated into business strategy discussions and strategic decision-making processes.",
    reflection: "Leading design transformation at Nagarro reinforced that effective design leadership requires equal focus on business outcomes and creative excellence. The experience demonstrated that coaching designers in strategic thinking creates exponential value beyond individual capability improvement - it transforms organizational design culture and client engagement quality. The success metrics validated that design leadership impact should be measured through business KPIs (brand recognition, lead generation, retention) rather than traditional design metrics alone. This approach established a replicable framework for elevating design influence within traditional consulting environments.",
    stakeholderQuotes: [
      {
        quote: "Randy transformed our design team from execution-focused to strategy-driven, creating measurable business impact that elevated our competitive position in the IT consulting market.",
        author: "Dr. Sarah Mueller",
        role: "VP of Digital Services, Nagarro"
      },
      {
        quote: "The coaching program didn't just improve my design skills - it taught me how to think strategically about business problems and communicate design value to executives.",
        author: "Marcus Chen",
        role: "Senior UX Designer, Nagarro"
      },
      {
        quote: "The thought leadership content strategy generated more qualified leads than any previous marketing initiative, establishing our design expertise as a key differentiator.",
        author: "Jennifer Rodriguez",
        role: "Director of Business Development, Nagarro"
      }
    ]
  }
};

describe("TDD: Nagarro Design Leadership Data Validation", () => {
  
  describe("Project Data Structure Integrity", () => {
    test("should have valid Nagarro project data structure", () => {
      expect(mockNagarroProject).toBeDefined();
      expect(typeof mockNagarroProject).toBe("object");
    });

    test("should have all required project fields", () => {
      // Core identification fields
      expect(mockNagarroProject.id).toBeDefined();
      expect(typeof mockNagarroProject.id).toBe("string");
      expect(mockNagarroProject.id.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.name).toBeDefined();
      expect(typeof mockNagarroProject.name).toBe("string");
      expect(mockNagarroProject.name.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.slug).toBeDefined();
      expect(typeof mockNagarroProject.slug).toBe("string");
      expect(mockNagarroProject.slug.length).toBeGreaterThan(0);
      
      // Content fields
      expect(mockNagarroProject.description).toBeDefined();
      expect(typeof mockNagarroProject.description).toBe("string");
      expect(mockNagarroProject.description.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.longDescription).toBeDefined();
      expect(typeof mockNagarroProject.longDescription).toBe("string");
      expect(mockNagarroProject.longDescription.length).toBeGreaterThan(0);
      
      // Classification fields
      expect(mockNagarroProject.category).toBeDefined();
      expect(typeof mockNagarroProject.category).toBe("string");
      
      expect(mockNagarroProject.categories).toBeDefined();
      expect(Array.isArray(mockNagarroProject.categories)).toBe(true);
      expect(mockNagarroProject.categories.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.tags).toBeDefined();
      expect(Array.isArray(mockNagarroProject.tags)).toBe(true);
      expect(mockNagarroProject.tags.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.technologies).toBeDefined();
      expect(Array.isArray(mockNagarroProject.technologies)).toBe(true);
      
      // Status and featured flags
      expect(typeof mockNagarroProject.featured).toBe("boolean");
      if (mockNagarroProject.archived !== undefined) {
        expect(typeof mockNagarroProject.archived).toBe("boolean");
      }
    });

    test("should have valid media references", () => {
      // Video should be present and valid
      expect(mockNagarroProject.video).toBeDefined();
      expect(typeof mockNagarroProject.video).toBe("string");
      expect(mockNagarroProject.video.length).toBeGreaterThan(0);
      expect(mockNagarroProject.video.startsWith("/projects/nagarro/")).toBe(true);
      
      // Thumbnail should be present and valid
      expect(mockNagarroProject.thumbnail).toBeDefined();
      expect(typeof mockNagarroProject.thumbnail).toBe("string");
      expect(mockNagarroProject.thumbnail.length).toBeGreaterThan(0);
      expect(mockNagarroProject.thumbnail.startsWith("/projects/nagarro/")).toBe(true);
      
      // Images array should be valid
      expect(mockNagarroProject.images).toBeDefined();
      expect(Array.isArray(mockNagarroProject.images)).toBe(true);
      expect(mockNagarroProject.images.length).toBeGreaterThan(0);
      
      // All images should have valid paths
      mockNagarroProject.images.forEach(image => {
        expect(typeof image).toBe("string");
        expect(image.startsWith("/projects/nagarro/")).toBe(true);
      });
    });

    test("should have valid metrics structure", () => {
      expect(mockNagarroProject.metrics).toBeDefined();
      expect(Array.isArray(mockNagarroProject.metrics)).toBe(true);
      expect(mockNagarroProject.metrics.length).toBeGreaterThan(0);
      
      mockNagarroProject.metrics.forEach(metric => {
        expect(metric.label).toBeDefined();
        expect(typeof metric.label).toBe("string");
        expect(metric.label.length).toBeGreaterThan(0);
        
        expect(metric.value).toBeDefined();
        expect(typeof metric.value).toBe("string");
        expect(metric.value.length).toBeGreaterThan(0);
        
        expect(metric.description).toBeDefined();
        expect(typeof metric.description).toBe("string");
        expect(metric.description.length).toBeGreaterThan(0);
        
        if (metric.performanceLevel) {
          expect(['excellent', 'good', 'average', 'poor']).toContain(metric.performanceLevel);
        }
      });
    });

    test("should have valid timeline and project metadata", () => {
      expect(mockNagarroProject.timeline).toBeDefined();
      expect(typeof mockNagarroProject.timeline).toBe("string");
      expect(mockNagarroProject.timeline).toContain("2022");
      
      expect(mockNagarroProject.status).toBeDefined();
      expect(['completed', 'in-progress', 'planned']).toContain(mockNagarroProject.status);
      
      expect(mockNagarroProject.teamSize).toBeDefined();
      expect(typeof mockNagarroProject.teamSize).toBe("number");
      expect(mockNagarroProject.teamSize).toBeGreaterThan(0);
      
      expect(mockNagarroProject.role).toBeDefined();
      expect(typeof mockNagarroProject.role).toBe("string");
      expect(mockNagarroProject.role.length).toBeGreaterThan(0);
    });
  });

  describe("Business Impact Validation", () => {
    test("should have measurable business impact metrics", () => {
      const impactMetrics = mockNagarroProject.metrics.filter(metric => 
        metric.performanceLevel === "excellent"
      );
      expect(impactMetrics.length).toBeGreaterThan(0);
      
      // Verify key business metrics exist
      const brandRecognitionMetric = mockNagarroProject.metrics.find(m => 
        m.label === "Brand Recognition Increase"
      );
      expect(brandRecognitionMetric).toBeDefined();
      expect(brandRecognitionMetric?.value).toBe("50%");
      
      const leadsMetric = mockNagarroProject.metrics.find(m => 
        m.label === "Qualified Leads Generated"
      );
      expect(leadsMetric).toBeDefined();
      expect(leadsMetric?.value).toBe("100+");
    });

    test("should have comprehensive challenge and solution mapping", () => {
      expect(mockNagarroProject.challenges).toBeDefined();
      expect(Array.isArray(mockNagarroProject.challenges)).toBe(true);
      expect(mockNagarroProject.challenges.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.solutions).toBeDefined();
      expect(Array.isArray(mockNagarroProject.solutions)).toBe(true);
      expect(mockNagarroProject.solutions.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.learnings).toBeDefined();
      expect(Array.isArray(mockNagarroProject.learnings)).toBe(true);
      expect(mockNagarroProject.learnings.length).toBeGreaterThan(0);
      
      // Challenges and solutions should be balanced
      expect(mockNagarroProject.challenges.length).toBeLessThanOrEqual(
        mockNagarroProject.solutions.length + 2
      );
    });

    test("should have design leadership focus in tags and categories", () => {
      expect(mockNagarroProject.category).toBe("Design Leadership");
      expect(mockNagarroProject.categories).toContain("Design Leadership");
      expect(mockNagarroProject.tags).toContain("Design Leadership");
      expect(mockNagarroProject.tags).toContain("Strategic Design");
      expect(mockNagarroProject.tags).toContain("Team Development");
    });
  });

  describe("Process Story Validation", () => {
    test("should have comprehensive process story structure", () => {
      expect(mockNagarroProject.processStory).toBeDefined();
      expect(typeof mockNagarroProject.processStory).toBe("object");
      
      expect(mockNagarroProject.processStory.background).toBeDefined();
      expect(typeof mockNagarroProject.processStory.background).toBe("string");
      expect(mockNagarroProject.processStory.background.length).toBeGreaterThan(100);
      
      expect(mockNagarroProject.processStory.approach).toBeDefined();
      expect(typeof mockNagarroProject.processStory.approach).toBe("string");
      expect(mockNagarroProject.processStory.approach.length).toBeGreaterThan(100);
      
      expect(mockNagarroProject.processStory.methodology).toBeDefined();
      expect(typeof mockNagarroProject.processStory.methodology).toBe("string");
      expect(mockNagarroProject.processStory.methodology.length).toBeGreaterThan(100);
      
      expect(mockNagarroProject.processStory.outcome).toBeDefined();
      expect(typeof mockNagarroProject.processStory.outcome).toBe("string");
      expect(mockNagarroProject.processStory.outcome.length).toBeGreaterThan(100);
      
      expect(mockNagarroProject.processStory.reflection).toBeDefined();
      expect(typeof mockNagarroProject.processStory.reflection).toBe("string");
      expect(mockNagarroProject.processStory.reflection.length).toBeGreaterThan(100);
    });

    test("should have key insights array with meaningful content", () => {
      expect(mockNagarroProject.processStory.keyInsights).toBeDefined();
      expect(Array.isArray(mockNagarroProject.processStory.keyInsights)).toBe(true);
      expect(mockNagarroProject.processStory.keyInsights.length).toBeGreaterThan(0);
      
      mockNagarroProject.processStory.keyInsights.forEach(insight => {
        expect(typeof insight).toBe("string");
        expect(insight.length).toBeGreaterThan(50);
      });
    });

    test("should have stakeholder quotes with proper attribution", () => {
      expect(mockNagarroProject.processStory.stakeholderQuotes).toBeDefined();
      expect(Array.isArray(mockNagarroProject.processStory.stakeholderQuotes)).toBe(true);
      expect(mockNagarroProject.processStory.stakeholderQuotes.length).toBeGreaterThan(0);
      
      mockNagarroProject.processStory.stakeholderQuotes.forEach(quote => {
        expect(quote.quote).toBeDefined();
        expect(typeof quote.quote).toBe("string");
        expect(quote.quote.length).toBeGreaterThan(30);
        
        expect(quote.author).toBeDefined();
        expect(typeof quote.author).toBe("string");
        expect(quote.author.length).toBeGreaterThan(0);
        
        expect(quote.role).toBeDefined();
        expect(typeof quote.role).toBe("string");
        expect(quote.role.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Overview and Constraints Validation", () => {
    test("should have detailed overview structure", () => {
      expect(mockNagarroProject.overview).toBeDefined();
      expect(typeof mockNagarroProject.overview).toBe("object");
      
      expect(mockNagarroProject.overview.deliverables).toBeDefined();
      expect(Array.isArray(mockNagarroProject.overview.deliverables)).toBe(true);
      expect(mockNagarroProject.overview.deliverables.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.overview.teamMembers).toBeDefined();
      expect(Array.isArray(mockNagarroProject.overview.teamMembers)).toBe(true);
      expect(mockNagarroProject.overview.teamMembers.length).toBeGreaterThan(0);
      
      expect(mockNagarroProject.overview.timelineDuration).toBeDefined();
      expect(typeof mockNagarroProject.overview.timelineDuration).toBe("string");
      
      expect(mockNagarroProject.overview.toolsUsed).toBeDefined();
      expect(Array.isArray(mockNagarroProject.overview.toolsUsed)).toBe(true);
      expect(mockNagarroProject.overview.toolsUsed.length).toBeGreaterThan(0);
    });

    test("should have comprehensive constraints documentation", () => {
      expect(mockNagarroProject.constraints).toBeDefined();
      expect(typeof mockNagarroProject.constraints).toBe("object");
      
      expect(mockNagarroProject.constraints.technical).toBeDefined();
      expect(Array.isArray(mockNagarroProject.constraints.technical)).toBe(true);
      
      expect(mockNagarroProject.constraints.environmental).toBeDefined();
      expect(Array.isArray(mockNagarroProject.constraints.environmental)).toBe(true);
      
      expect(mockNagarroProject.constraints.location).toBeDefined();
      expect(Array.isArray(mockNagarroProject.constraints.location)).toBe(true);
    });
  });

  describe("Integration with Existing Work Experience", () => {
    test("should align with Nagarro work experience data", () => {
      const nagarroWorkExperience = WORK_EXPERIENCE.find(work => 
        work.company === "Nagarro"
      );
      
      expect(nagarroWorkExperience).toBeDefined();
      expect(nagarroWorkExperience?.title).toBe("Head of Design");
      expect(nagarroWorkExperience?.start).toBe("Mar 2022");
      expect(nagarroWorkExperience?.end).toBe("Oct 2022");
      
      // Timeline should match work experience dates
      expect(mockNagarroProject.timeline).toContain("Mar 2022");
      expect(mockNagarroProject.timeline).toContain("Oct 2022");
      
      // Role should align with work experience title
      expect(mockNagarroProject.role).toContain("Head of Design");
    });

    test("should validate timeline consistency", () => {
      const timelineRegex = /Mar 2022.*Oct 2022/;
      expect(mockNagarroProject.timeline).toMatch(timelineRegex);
      
      expect(mockNagarroProject.overview.timelineDuration).toContain("8 months");
    });
  });

  describe("Data Quality and Consistency", () => {
    test("should have unique identifiers", () => {
      expect(mockNagarroProject.id).toMatch(/^[a-z0-9-]+$/);
      expect(mockNagarroProject.slug).toMatch(/^[a-z0-9-]+$/);
      expect(mockNagarroProject.id).toBe(mockNagarroProject.slug);
    });

    test("should have consistent naming conventions", () => {
      // All deliverables should be properly capitalized
      mockNagarroProject.overview.deliverables.forEach(deliverable => {
        expect(deliverable.charAt(0)).toMatch(/[A-Z]/);
      });
      
      // All technologies should be valid strings
      mockNagarroProject.technologies.forEach(tech => {
        expect(typeof tech).toBe("string");
        expect(tech.length).toBeGreaterThan(0);
      });
    });

    test("should have appropriate content length validation", () => {
      // Description should be concise but informative
      expect(mockNagarroProject.description.length).toBeGreaterThan(50);
      expect(mockNagarroProject.description.length).toBeLessThan(500);
      
      // Long description should be comprehensive
      expect(mockNagarroProject.longDescription.length).toBeGreaterThan(200);
      
      // Each process story section should be substantial
      expect(mockNagarroProject.processStory.background.length).toBeGreaterThan(200);
      expect(mockNagarroProject.processStory.approach.length).toBeGreaterThan(200);
      expect(mockNagarroProject.processStory.methodology.length).toBeGreaterThan(200);
    });

    test("should validate external links and references", () => {
      expect(mockNagarroProject.link).toBeDefined();
      expect(mockNagarroProject.link.startsWith("https://")).toBe(true);
      expect(mockNagarroProject.link).toContain("nagarro.com");
    });
  });

  describe("Design Leadership Focus Validation", () => {
    test("should emphasize strategic design thinking", () => {
      const strategicKeywords = [
        "strategic", "strategy", "leadership", "transformation", 
        "coaching", "development", "business impact"
      ];
      
      const descriptionLower = mockNagarroProject.description.toLowerCase();
      const containsStrategicKeywords = strategicKeywords.some(keyword => 
        descriptionLower.includes(keyword)
      );
      expect(containsStrategicKeywords).toBe(true);
    });

    test("should include team development and coaching elements", () => {
      expect(mockNagarroProject.tags).toContain("Team Development");
      expect(mockNagarroProject.tags).toContain("Design Coaching");
      
      // Should mention team size in context of leadership
      expect(mockNagarroProject.teamSize).toBe(15);
      expect(mockNagarroProject.role).toContain("Head of Design");
    });

    test("should demonstrate measurable business outcomes", () => {
      const businessImpactMetrics = mockNagarroProject.metrics.filter(metric => 
        metric.label.includes("Brand") || 
        metric.label.includes("Leads") || 
        metric.label.includes("Traffic") ||
        metric.label.includes("Retention")
      );
      
      expect(businessImpactMetrics.length).toBeGreaterThan(2);
    });
  });
});