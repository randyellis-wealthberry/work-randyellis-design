import { FAQStructuredData } from "./structured-data";

export interface ProjectFAQ {
  question: string;
  answer: string;
}

interface ProjectFAQProps {
  projectSlug: string;
}

// FAQ data for different projects
const PROJECT_FAQS: Record<string, ProjectFAQ[]> = {
  growit: [
    {
      question: "How did GrowIt achieve 1M+ users so quickly?",
      answer: "GrowIt's rapid growth came from a three-phase strategy focusing on community building first, then engagement features, and finally expert partnerships with Ball Horticultural Company. The geolocation-based discovery helped users find relevant local gardening content, while plant identification features using machine learning created viral sharing moments."
    },
    {
      question: "What technologies power GrowIt's plant identification?", 
      answer: "GrowIt uses a combination of machine learning algorithms for image recognition, integrated with React Native for mobile performance. The plant identification is enhanced by community verification and expert validation from our horticultural partners, ensuring accuracy while building community engagement."
    },
    {
      question: "How does GrowIt maintain a 4.8★ App Store rating?",
      answer: "The high rating stems from user-centered design focused on solving real gardening problems, seamless social features that connect gardening enthusiasts, and continuous improvements based on user feedback. Regular feature updates and responsive customer support maintain user satisfaction."
    }
  ],
  echo: [
    {
      question: "What makes Echo different from other design systems?",
      answer: "Echo focuses specifically on AI-powered design workflows, integrating generative AI tools directly into the design process. Unlike traditional design systems, Echo adapts to user behavior and provides intelligent suggestions for component usage and design decisions."
    },
    {
      question: "How long does it take to implement Echo in a project?",
      answer: "Most teams can integrate Echo's core components within 1-2 weeks. The AI-powered features and full design system adoption typically takes 4-6 weeks, depending on project complexity and team size."
    }
  ],
  metis: [
    {
      question: "How does METIS help with business strategy decisions?",
      answer: "METIS analyzes market data, user behavior patterns, and competitive landscapes to provide data-driven strategy recommendations. It combines AI analysis with proven business frameworks to help product designers make strategic decisions that align with business objectives."
    },
    {
      question: "Can METIS integrate with existing design workflows?",
      answer: "Yes, METIS is built to complement existing design tools like Figma, Sketch, and Adobe Creative Suite. It provides insights and recommendations that enhance rather than replace current workflows, making it easy to adopt incrementally."
    }
  ],
  addvanced: [
    {
      question: "What problem does Addvanced solve for financial advisors?",
      answer: "Addvanced streamlines the client onboarding process by reducing paperwork and manual data entry by 70%. It automates compliance checks, generates required documentation, and provides a mobile-first experience that clients can complete from anywhere."
    },
    {
      question: "How secure is Addvanced for handling financial data?",
      answer: "Addvanced follows enterprise-grade security protocols including end-to-end encryption, SOC 2 compliance, and regular security audits. All financial data is processed according to industry standards and regulations, ensuring client information remains protected."
    }
  ]
};

export function ProjectFAQStructuredData({ projectSlug }: ProjectFAQProps) {
  const faqs = PROJECT_FAQS[projectSlug];
  
  if (!faqs || faqs.length === 0) return null;

  // Transform to FAQ structured data format
  const faqItems = faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer", 
      text: faq.answer
    }
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema)
      }}
    />
  );
}

export function getProjectFAQs(projectSlug: string): ProjectFAQ[] {
  return PROJECT_FAQS[projectSlug] || [];
}