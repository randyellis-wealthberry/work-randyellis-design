import Script from "next/script";

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
    alumniOf: {
      "@type": "Organization",
      name: "Nagarro",
    },
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
