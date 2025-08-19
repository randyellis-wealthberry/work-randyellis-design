import { PROJECTS } from "@/lib/data/projects";
import { Project } from "@/lib/data/types";

describe("Echo Project Data Integration", () => {
  let echoProject: Project | undefined;

  beforeAll(() => {
    echoProject = PROJECTS.find((p) => p.id === "echo");
  });

  describe("Project Existence and Basic Properties", () => {
    it("should find the Echo project in the projects array", () => {
      expect(echoProject).toBeDefined();
      expect(echoProject?.id).toBe("echo");
    });

    it("should have correct basic metadata", () => {
      expect(echoProject?.name).toBe("EchoDrive");
      expect(echoProject?.subtitle).toBe(
        "AI-Powered Cloud Intelligence Platform",
      );
      expect(echoProject?.slug).toBe("echo");
      expect(echoProject?.category).toBe("Enterprise (SaaS)");
    });

    it("should be marked as featured", () => {
      expect(echoProject?.featured).toBe(true);
    });

    it("should have completed status", () => {
      expect(echoProject?.status).toBe("completed");
    });

    it("should have correct timeline", () => {
      expect(echoProject?.timeline).toBe("Jan 2022 - Aug 2022");
    });
  });

  describe("Content and Descriptions", () => {
    it("should have comprehensive descriptions", () => {
      expect(echoProject?.description).toBeDefined();
      expect(echoProject?.description.length).toBeGreaterThan(100);
      expect(echoProject?.description).toContain("AI-powered");
      expect(echoProject?.description).toContain("cloud storage");
      expect(echoProject?.description).toContain("67% productivity boost");
    });

    it("should have detailed long description", () => {
      expect(echoProject?.longDescription).toBeDefined();
      expect(echoProject?.longDescription!.length).toBeGreaterThan(500);
      expect(echoProject?.longDescription).toContain(
        "intelligent file ecosystem",
      );
      expect(echoProject?.longDescription).toContain("computer vision");
      expect(echoProject?.longDescription).toContain(
        "natural language processing",
      );
    });

    it("should contain key AI/ML terminology", () => {
      const description = echoProject?.description || "";
      const longDescription = echoProject?.longDescription || "";
      const combinedText = description + " " + longDescription;

      expect(combinedText).toContain("AI");
      expect(combinedText).toContain("intelligent");
      expect(combinedText).toContain("automation");
      // Check for ML concepts even if not exact phrase "machine learning"
      expect(combinedText.toLowerCase()).toMatch(
        /(machine learning|ml|artificial intelligence|predictive|computer vision)/,
      );
    });
  });

  describe("Categories and Tags", () => {
    it("should have correct categories", () => {
      expect(echoProject?.categories).toEqual([
        "Enterprise (SaaS)",
        "AI/ML",
        "Web Dev",
      ]);
    });

    it("should have comprehensive AI/ML tags", () => {
      const expectedTags = [
        "Artificial Intelligence",
        "Cloud Storage",
        "Machine Learning",
        "Computer Vision",
        "Natural Language Processing",
        "Intelligent Automation",
        "Enterprise Collaboration",
        "Predictive Analytics",
      ];

      expectedTags.forEach((tag) => {
        expect(echoProject?.tags).toContain(tag);
      });
    });

    it("should have modern technology tags", () => {
      const techTags = [
        "Graph Databases",
        "Smart Workflows",
        "File Intelligence",
        "Storage Optimization",
      ];

      techTags.forEach((tag) => {
        expect(echoProject?.tags).toContain(tag);
      });
    });
  });

  describe("Technologies Stack", () => {
    it("should include core web technologies", () => {
      expect(echoProject?.technologies).toContain("React");
      expect(echoProject?.technologies).toContain("Node.js");
      expect(echoProject?.technologies).toContain("PostgreSQL");
    });

    it("should include AI/ML technologies", () => {
      expect(echoProject?.technologies).toContain("TensorFlow");
      expect(echoProject?.technologies).toContain("Python ML");
      expect(echoProject?.technologies).toContain("Computer Vision");
      expect(echoProject?.technologies).toContain("NLP");
    });

    it("should include cloud and infrastructure technologies", () => {
      expect(echoProject?.technologies).toContain("AWS S3");
      expect(echoProject?.technologies).toContain("Docker");
      expect(echoProject?.technologies).toContain("Kubernetes");
      expect(echoProject?.technologies).toContain("ElasticSearch");
    });

    it("should include enterprise-scale technologies", () => {
      expect(echoProject?.technologies).toContain("Apache Kafka");
      expect(echoProject?.technologies).toContain("Redis");
      expect(echoProject?.technologies).toContain("Graph Databases");
    });
  });

  describe("Metrics and Performance Data", () => {
    it("should have comprehensive metrics array", () => {
      expect(echoProject?.metrics).toBeDefined();
      expect(echoProject?.metrics!.length).toBeGreaterThanOrEqual(6);
    });

    it("should include key performance metrics", () => {
      const metricLabels = echoProject?.metrics?.map((m) => m.label) || [];

      expect(metricLabels).toContain("Files Automatically Organized");
      expect(metricLabels).toContain("Team Productivity Boost");
      expect(metricLabels).toContain("Storage Cost Reduction");
      expect(metricLabels).toContain("Search Accuracy");
    });

    it("should have impressive metric values", () => {
      const metrics = echoProject?.metrics || [];

      // Find specific metrics and verify their values
      const productivityMetric = metrics.find(
        (m) => m.label === "Team Productivity Boost",
      );
      expect(productivityMetric?.value).toBe("67%");

      const searchAccuracy = metrics.find((m) => m.label === "Search Accuracy");
      expect(searchAccuracy?.value).toBe("95%");

      const filesOrganized = metrics.find(
        (m) => m.label === "Files Automatically Organized",
      );
      expect(filesOrganized?.value).toBe("1M+");
    });

    it("should have metrics that support the main narrative", () => {
      const metrics = echoProject?.metrics || [];
      const description = echoProject?.description || "";

      // Productivity boost should be mentioned in both metrics and description
      const productivityMetric = metrics.find(
        (m) => m.label === "Team Productivity Boost",
      );
      expect(productivityMetric?.value).toBe("67%");
      expect(description).toContain("67% productivity boost");
    });
  });

  describe("Challenges and Solutions", () => {
    it("should define comprehensive challenges", () => {
      expect(echoProject?.challenges).toBeDefined();
      expect(echoProject?.challenges!.length).toBeGreaterThanOrEqual(5);
    });

    it("should address enterprise-scale file management challenges", () => {
      const challenges = echoProject?.challenges?.join(" ") || "";

      expect(challenges.toLowerCase()).toContain("enterprise scale");
      expect(challenges).toContain("manual organization");
      expect(challenges).toContain("search capabilities");
      expect(challenges.toLowerCase()).toMatch(
        /(collaboration.*inefficienc|inefficient.*collaboration)/,
      );
      expect(challenges.toLowerCase()).toContain("storage cost optimization");
    });

    it("should provide AI-focused solutions", () => {
      const solutions = echoProject?.solutions?.join(" ") || "";

      expect(solutions).toContain("AI-powered");
      expect(solutions).toContain("computer vision");
      expect(solutions).toContain("NLP");
      expect(solutions.toLowerCase()).toMatch(
        /(machine learning|predictive|intelligent)/,
      );
      expect(solutions).toContain("intelligent search");
    });

    it("should have equal number of solutions to challenges", () => {
      expect(echoProject?.solutions?.length).toEqual(
        echoProject?.challenges?.length,
      );
    });
  });

  describe("Process Story and Learning Outcomes", () => {
    it("should have detailed process story", () => {
      expect(echoProject?.processStory).toBeDefined();

      const processStory = echoProject?.processStory;
      expect(processStory?.approach).toBeDefined();
      expect(processStory?.methodology).toBeDefined();
      expect(processStory?.keyInsights).toBeDefined();
      expect(processStory?.outcome).toBeDefined();
      expect(processStory?.reflection).toBeDefined();
    });

    it("should emphasize AI-first approach in process story", () => {
      const approach = echoProject?.processStory?.approach || "";

      expect(approach.toLowerCase()).toMatch(
        /(ai-powered|ai-first|artificial intelligence)/,
      );
      expect(approach).toContain("Content Intelligence");
      expect(approach).toContain("Behavioral Learning");
      expect(approach.toLowerCase()).toMatch(/(machine learning|ml)/);
    });

    it("should include measurable outcomes", () => {
      const outcome = echoProject?.processStory?.outcome || "";

      expect(outcome).toContain("1 million files");
      expect(outcome).toContain("95% search accuracy");
      expect(outcome).toContain("67% productivity boost");
      expect(outcome.toLowerCase()).toMatch(
        /storage.*cost.*45%|45%.*storage.*cost/i,
      );
    });

    it("should have stakeholder quotes", () => {
      expect(echoProject?.processStory?.stakeholderQuotes).toBeDefined();
      expect(
        echoProject?.processStory?.stakeholderQuotes!.length,
      ).toBeGreaterThanOrEqual(3);

      echoProject?.processStory?.stakeholderQuotes?.forEach((quote) => {
        expect(quote.quote).toBeDefined();
        expect(quote.author).toBeDefined();
        expect(quote.role).toBeDefined();
        expect(quote.quote.length).toBeGreaterThan(50);
      });
    });

    it("should have meaningful learnings", () => {
      expect(echoProject?.learnings).toBeDefined();
      expect(echoProject?.learnings!.length).toBeGreaterThanOrEqual(4);

      const learnings = echoProject?.learnings?.join(" ") || "";
      expect(learnings).toContain("AI");
      expect(learnings.toLowerCase()).toMatch(
        /(enterprise|organization|workflow)/,
      );
      expect(learnings.toLowerCase()).toMatch(/(intelligence|intelligent)/);
    });
  });

  describe("Media and Visual Assets", () => {
    it("should have proper media paths", () => {
      expect(echoProject?.video).toBe(
        "/projects/echo/echodrive-mockup-video.mp4",
      );
      expect(echoProject?.thumbnail).toBe("/projects/echo/poster.png");
      expect(echoProject?.link).toBe("/echo");
    });

    it("should have images array", () => {
      expect(echoProject?.images).toBeDefined();
      expect(echoProject?.images!.length).toBeGreaterThanOrEqual(3);

      echoProject?.images?.forEach((imagePath) => {
        expect(imagePath).toMatch(/^\/projects\/echo\//);
        expect(imagePath).toMatch(/\.(jpg|png|svg|webp)$/i);
      });
    });
  });

  describe("Team and Role Information", () => {
    it("should have team size information", () => {
      expect(echoProject?.teamSize).toBeDefined();
      expect(typeof echoProject?.teamSize).toBe("number");
      expect(echoProject?.teamSize).toBeGreaterThan(0);
    });

    it("should have role definition", () => {
      expect(echoProject?.role).toBeDefined();
      expect(typeof echoProject?.role).toBe("string");
      expect(echoProject?.role?.length).toBeGreaterThan(5);
    });
  });

  describe("Data Consistency and Quality", () => {
    it("should have consistent metric values across description and metrics array", () => {
      const description = echoProject?.description || "";
      const metrics = echoProject?.metrics || [];

      // Check that the 67% productivity boost is mentioned consistently
      expect(description).toContain("67%");
      const productivityMetric = metrics.find((m) => m.value.includes("67%"));
      expect(productivityMetric).toBeDefined();
    });

    it("should have consistent AI theme across all text content", () => {
      const allText = [
        echoProject?.description,
        echoProject?.longDescription,
        echoProject?.processStory?.approach,
        echoProject?.processStory?.methodology,
        echoProject?.processStory?.outcome,
        echoProject?.processStory?.reflection,
      ]
        .filter(Boolean)
        .join(" ");

      expect(allText).toContain("AI");
      expect(allText).toContain("intelligent");
      expect(allText).toContain("machine learning");
    });

    it("should not have lorem ipsum or placeholder text", () => {
      const allText = [
        echoProject?.description,
        echoProject?.longDescription,
        echoProject?.processStory?.approach,
        echoProject?.processStory?.methodology,
        echoProject?.processStory?.outcome,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      expect(allText).not.toContain("lorem ipsum");
      expect(allText).not.toContain("placeholder");
      expect(allText).not.toContain("todo");
      expect(allText).not.toContain("[insert");
    });

    it("should have proper sentence structure and grammar", () => {
      const description = echoProject?.description || "";

      // Should start with capital letter and end with period
      expect(description.charAt(0)).toMatch(/[A-Z]/);
      expect(description.endsWith(".")).toBe(true);

      // Should not have multiple consecutive spaces
      expect(description).not.toMatch(/  +/);
    });
  });

  describe("Enhanced Metrics for Echo Client Component", () => {
    it("should provide data that supports the enhanced metrics used in the component", () => {
      // The Echo client component uses these specific enhanced metrics:
      const expectedEnhancedMetrics = [
        "Storage Efficiency", // 35%
        "Search Speed", // 5x faster
        "User Adoption", // 89%
        "Collaboration Boost", // 67%
      ];

      // Verify the base project data supports these enhanced metrics
      const metricsText =
        echoProject?.metrics?.map((m) => `${m.label}: ${m.value}`).join(" ") ||
        "";
      const outcomeText = echoProject?.processStory?.outcome || "";
      const combinedMetrics = metricsText + " " + outcomeText;

      expect(combinedMetrics).toContain("67%"); // Collaboration/Productivity boost
      expect(combinedMetrics).toContain("95%"); // Search accuracy (supports 5x faster claim)
      expect(outcomeText).toContain("45%"); // Storage cost reduction (supports 35% efficiency)
    });
  });
});
