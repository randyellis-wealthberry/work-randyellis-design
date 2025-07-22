import Script from "next/script";

// Breadcrumb structured data for navigation
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
  );
}

// Organization structured data for Wealthberry Labs
export function OrganizationStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wealthberry Labs",
    url: "https://www.buildyourlegacywithai.com",
    description:
      "AI-powered financial planning and wealth management solutions company led by innovative product design and engineering.",
    founder: {
      "@type": "Person",
      name: "Randy Ellis",
    },
    employee: [
      {
        "@type": "Person",
        name: "Randy Ellis",
        jobTitle: "Head of Product",
      },
    ],
    industry: "Financial Technology",
    knowsAbout: [
      "AI Financial Planning",
      "Wealth Management Technology",
      "Generative AI Applications",
      "Product Design",
    ],
  };

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
    />
  );
}

export function PersonStructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Randy Ellis",
    jobTitle: "AI Product Design Engineer",
    description:
      "Leading AI Product Design Engineer specializing in generative AI, design systems, and product leadership. Head of Product at Wealthberry Labs with 2.5M+ users impacted.",
    url: "https://work.randyellis.design",
    image: "https://work.randyellis.design/randy-ellis-profile.jpg",
    sameAs: [
      "https://www.linkedin.com/in/iamrandyellis/",
      "https://github.com/ibelick",
      "https://twitter.com/ibelick",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Wealthberry Labs",
      url: "https://www.buildyourlegacywithai.com",
    },
    alumniOf: [
      {
        "@type": "Organization",
        name: "Nagarro",
      },
      {
        "@type": "Organization",
        name: "General Assembly",
      },
      {
        "@type": "Organization",
        name: "ThrivedX",
      },
    ],
    knowsAbout: [
      "AI Product Design",
      "Generative AI",
      "Design Systems",
      "Product Leadership",
      "UX Research",
      "Design Engineering",
      "React",
      "Next.js",
      "TypeScript",
      "Leadership Communication",
      "AI Design Tools",
      "Product Strategy",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "AI Product Design Engineer",
      occupationLocation: {
        "@type": "City",
        name: "Chicago",
      },
      skills: [
        "AI Product Design",
        "Generative AI",
        "Design Systems",
        "Product Leadership",
        "UX Research",
        "Design Engineering",
      ],
    },
    award: [
      "6 Design Awards for innovative design work",
      "4.8★ App Store rating for GrowIt project",
      "Recognition for AI Design System Generator",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Trustworthy Generative AI",
        credentialCategory: "Professional Certification",
        educationalLevel: "Professional",
        recognizedBy: {
          "@type": "Organization",
          name: "Vanderbilt University",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Google AI Essentials",
        credentialCategory: "Professional Certification",
        educationalLevel: "Professional",
        recognizedBy: {
          "@type": "Organization",
          name: "Google",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Leadership Through Social Influence",
        credentialCategory: "Professional Certification",
        educationalLevel: "Professional",
        recognizedBy: {
          "@type": "Organization",
          name: "Northwestern University",
        },
      },
    ],
    performerIn: [
      {
        "@type": "Project",
        name: "GrowIt - Gardening App",
        description:
          "One of the fastest-growing gardening apps in the U.S. with 100K+ users and 4.8★ rating",
      },
      {
        "@type": "Project",
        name: "AI Design System Generator",
        description: "Open-source tool for generating design systems using AI",
      },
      {
        "@type": "Project",
        name: "METIS: AI Business Strategy Agent",
        description: "AI-powered business strategy tool for product designers",
      },
    ],
  };

  return (
    <Script
      id="person-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema),
      }}
    />
  );
}

export function WebsiteStructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "Website",
    name: "Randy Ellis - AI Product Design Engineer",
    description:
      "Portfolio of Randy Ellis, AI Product Design Engineer specializing in generative AI, design systems, and product leadership.",
    url: "https://work.randyellis.design",
    author: {
      "@type": "Person",
      name: "Randy Ellis",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://work.randyellis.design/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema),
      }}
    />
  );
}

export function ProfessionalServiceStructuredData() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Randy Ellis Design Services",
    description:
      "AI Product Design Engineering services including generative AI implementation, design systems, and product leadership consulting.",
    provider: {
      "@type": "Person",
      name: "Randy Ellis",
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Design Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Product Design",
            description: "Comprehensive AI-powered product design services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Design Systems",
            description: "Scalable design system creation and implementation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Product Leadership",
            description: "Strategic product leadership and team guidance",
          },
        },
      ],
    },
  };

  return (
    <Script
      id="professional-service-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema),
      }}
    />
  );
}
