"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackStructuredDataView } from "@/lib/analytics";
import { createAbsoluteUrl } from "@/lib/env";

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

export function PersonStructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Randy Ellis",
    jobTitle: [
      "Head of Product",
      "Fractional Chief Design Officer",
      "AI Product Design Engineer",
    ],
    description:
      "Head of Product & Fractional Chief Design Officer specializing in generative AI, design systems, and startup product leadership. Head of Product at Wealthberry Labs with 2.5M+ users impacted. Available for fractional CDO engagements through Chameleon Collective, Go Fractional, and direct startup partnerships.",
    url: createAbsoluteUrl(),
    image: createAbsoluteUrl("/images/randy-ellis-official-avatar.png"),
    sameAs: [
      "https://www.linkedin.com/in/iamrandyellis/",
      "https://github.com/randyellis-wealthberry",
      "https://twitter.com/iamrandyellis",
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
      "Fractional Chief Design Officer",
      "Startup Design Leadership",
      "Venture-backed Design Scaling",
      "Design Systems Architecture",
      "Remote Design Management",
      "Fractional Executive Services",
      "Chameleon Collective Partnership",
      "Go Fractional Design Leadership",
      "Startup Advisory Services",
      "Design Operations",
      "Product Design Consulting",
    ],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "AI Product Design Engineer",
        occupationLocation: {
          "@type": "Place",
          name: "Remote (United States)",
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
      {
        "@type": "Occupation",
        name: "Fractional Chief Design Officer",
        description:
          "Part-time Chief Design Officer services for startups and venture-backed companies",
        occupationLocation: {
          "@type": "Place",
          name: "Remote/Worldwide",
        },
        skills: [
          "Startup Design Leadership",
          "Design Systems Scaling",
          "Fractional Executive Management",
          "Venture Capital Design Strategy",
          "Remote Team Leadership",
          "Design Operations Setup",
          "Startup Advisory Services",
        ],
        worksFor: {
          "@type": "Organization",
          name: "Fractional CDO Services",
          description:
            "Providing part-time Chief Design Officer expertise to startups",
        },
      },
    ],
    award: [
      "Silver Award, The Davey Awards — Mobile Apps/Social (GrowIt!)",
      "Silver Award, The Davey Awards — Mobile Apps/Lifestyle (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best User Interface App/Experience (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best Lifestyle App (GrowIt!)",
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
          "One of the fastest-growing gardening apps in the U.S. with 240K+ active users and 4.8★ rating",
      },
      {
        "@type": "Project",
        name: "AI Design System Generator",
        description: "Open-source tool for generating design systems using AI",
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
    name: "Randy Ellis - Head of Product & Fractional CDO",
    description:
      "Portfolio of Randy Ellis, Head of Product & Fractional Chief Design Officer specializing in generative AI, design systems, and product leadership.",
    url: createAbsoluteUrl(),
    author: {
      "@type": "Person",
      name: "Randy Ellis",
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
      url: createAbsoluteUrl(),
      jobTitle: "Head of Product & Fractional Chief Design Officer",
      worksFor: {
        "@type": "Organization",
        name: "Wealthberry Labs",
      },
    },
    publisher: {
      "@type": "Person",
      name: "Randy Ellis",
      url: createAbsoluteUrl(),
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
  dateCreated?: string;
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
      url: createAbsoluteUrl(),
      jobTitle: "Head of Product & Fractional Chief Design Officer",
      worksFor: {
        "@type": "Organization",
        name: "Wealthberry Labs",
      },
    },
    ...(dateCreated && { dateCreated }),
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
  // Track structured data rendering
  useEffect(() => {
    trackStructuredDataView("LocalBusiness", "chicago-design-services");
  }, []);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Randy Ellis Design Services",
    description:
      "AI Product Design Engineering services specializing in generative AI implementation, design systems, and product leadership consulting, delivered remotely across the United States.",
    url: createAbsoluteUrl(),
    image: createAbsoluteUrl("/images/randy-ellis-official-avatar.png"),
    email: "randy.ellis.pro@gmail.com",
    founder: {
      "@type": "Person",
      name: "Randy Ellis",
      url: createAbsoluteUrl(),
      jobTitle: "Head of Product & Fractional Chief Design Officer",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    areaServed: [
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
            description:
              "Strategic AI product design and implementation guidance",
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
