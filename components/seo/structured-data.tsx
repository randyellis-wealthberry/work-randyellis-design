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

export function FAQStructuredData() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's your approach to AI in design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I believe AI should enhance human creativity, not replace it. My work on the AI Design System Generator demonstrates how AI can accelerate the design process while maintaining design quality and accessibility. I focus on leveraging AI to automate repetitive tasks, generate intelligent suggestions, and help designers make more informed decisions based on data and user behavior patterns.",
        },
      },
      {
        "@type": "Question",
        name: "How do you bridge design and development?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With a background spanning both design leadership and hands-on development, I understand the challenges on both sides. I create design systems that are technically feasible, write production-ready React code, and ensure designs translate seamlessly to implementation. My approach involves early technical validation, component-driven design, and close collaboration between design and engineering teams throughout the product development lifecycle.",
        },
      },
      {
        "@type": "Question",
        name: "What's your experience with scaling products?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I've led product design for applications serving 2.5M+ users, including the GrowIt gardening platform that reached 1M+ users across 25K+ cities. My experience spans from startup MVP validation to enterprise-scale design systems. I focus on building scalable design foundations, establishing design processes that grow with teams, and ensuring user experience quality remains consistent as products expand globally.",
        },
      },
    ],
  };

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}

export function ArticleStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  url,
  imageUrl,
  keywords = [],
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  imageUrl?: string;
  keywords?: string[];
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: "Randy Ellis",
      url: "https://work.randyellis.design",
      jobTitle: "AI Product Design Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Wealthberry Labs",
      },
    },
    publisher: {
      "@type": "Person",
      name: "Randy Ellis",
      url: "https://work.randyellis.design",
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    url: url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
    articleSection: "AI Product Design",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    genre: ["Technology", "Design", "AI", "Product Design"],
  };

  return (
    <Script
      id="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  );
}

export function CreativeWorkStructuredData({
  name,
  description,
  url,
  dateCreated,
  technologies,
  category,
  metrics,
  imageUrl,
  teamSize,
  role,
}: {
  name: string;
  description: string;
  url: string;
  dateCreated: string;
  technologies: string[];
  category: string;
  metrics?: Array<{ label: string; value: string }>;
  imageUrl?: string;
  teamSize?: number;
  role?: string;
}) {
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: name,
    description: description,
    url: url,
    creator: {
      "@type": "Person",
      name: "Randy Ellis",
      url: "https://work.randyellis.design",
      jobTitle: "AI Product Design Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Wealthberry Labs",
      },
    },
    dateCreated: dateCreated,
    genre: category,
    keywords: technologies.join(", "),
    inLanguage: "en-US",
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
    ...(role && {
      contributor: {
        "@type": "Person",
        name: "Randy Ellis",
        roleName: role,
      },
    }),
    ...(metrics &&
      metrics.length > 0 && {
        additionalProperty: metrics.map((metric) => ({
          "@type": "PropertyValue",
          name: metric.label,
          value: metric.value,
        })),
      }),
    ...(teamSize && {
      about: {
        "@type": "Thing",
        name: "Team Collaboration",
        description: `Collaborative project with ${teamSize} team members`,
      },
    }),
    license: "All Rights Reserved",
    copyrightHolder: {
      "@type": "Person",
      name: "Randy Ellis",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <Script
      id="creative-work-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(creativeWorkSchema),
      }}
    />
  );
}

export function LocalBusinessStructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Randy Ellis Design Services",
    description:
      "AI Product Design Engineering services specializing in generative AI implementation, design systems, and product leadership consulting in Chicago.",
    url: "https://work.randyellis.design",
    image: "https://work.randyellis.design/randy-ellis-profile.jpg",
    telephone: "+1-XXX-XXX-XXXX", // Replace with actual number if available
    email: "contact@work.randyellis.design", // Replace with actual email
    founder: {
      "@type": "Person",
      name: "Randy Ellis",
      url: "https://work.randyellis.design",
      jobTitle: "AI Product Design Engineer",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chicago",
      addressRegion: "IL",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.8781",
      longitude: "-87.6298",
    },
    areaServed: [
      {
        "@type": "Place",
        name: "Chicago, IL",
      },
      {
        "@type": "Place",
        name: "United States",
      },
      {
        "@type": "Place", 
        name: "Remote/Worldwide",
      },
    ],
    serviceType: [
      "AI Product Design",
      "Design Systems",
      "Product Leadership Consulting",
      "UX Research",
      "Design Engineering",
      "Generative AI Implementation",
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
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI Product Design Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Product Design Consulting",
            description: "Strategic AI product design and implementation guidance",
          },
          areaServed: "Worldwide",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Design Systems Development",
            description: "Scalable design system creation and implementation",
          },
          areaServed: "Worldwide",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Product Leadership Consulting",
            description: "Strategic product leadership and team guidance",
          },
          areaServed: "Worldwide",
        },
      ],
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
      validFrom: "2024-01-01",
    },
    paymentAccepted: ["Cash", "Credit Card", "Invoice", "Digital Payment"],
    currenciesAccepted: "USD",
    priceRange: "$$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "15",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      "https://www.linkedin.com/in/iamrandyellis/",
      "https://github.com/randyellis-wealthberry",
      "https://x.com/iamrandyellis",
    ],
  };

  return (
    <Script
      id="local-business-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema),
      }}
    />
  );
}
