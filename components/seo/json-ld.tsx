import { SITE_IDENTITY } from "@/app/(main)/site-identity";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const { name, meta, contact, business, domain } = SITE_IDENTITY;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: `https://${domain}`,
    logo: `https://${domain}/logo.png`,
    description: meta.description,
    foundingDate: String(business.established),
    founder: { "@type": "Person", name: meta.author },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contact.phone.raw,
      contactType: "customer service",
      email: contact.email.support,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.office,
      addressLocality: contact.address.city,
      addressCountry: "IN",
    },
    sameAs: [
      contact.socials.instagram,
      contact.socials.linkedin,
      contact.socials.whatsapp,
      contact.socials.youtube,
    ].filter(Boolean),
  };
  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const { name, meta, domain } = SITE_IDENTITY;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: `https://${domain}`,
    description: meta.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://${domain}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const { domain } = SITE_IDENTITY;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://${domain}${item.url}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function CollegeJsonLd({
  name,
  description,
  url,
  image,
  address,
  aggregateRating,
}: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  address: { street?: string; city: string; country: string };
  aggregateRating?: { ratingValue: number; ratingCount: number; bestRating?: number };
}) {
  const { domain } = SITE_IDENTITY;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name,
    description,
    url: `https://${domain}${url}`,
    ...(image && { image: `https://${domain}${image.startsWith("http") ? "" : "/"}${image}` }),
    address: {
      "@type": "PostalAddress",
      addressLocality: address.city,
      addressCountry: address.country,
    },
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        ratingCount: aggregateRating.ratingCount,
        bestRating: aggregateRating.bestRating || 5,
      },
    }),
  };
  return <JsonLd data={data} />;
}

export function CourseJsonLd({
  name,
  description,
  provider,
  url,
}: {
  name: string;
  description: string;
  provider: string;
  url: string;
}) {
  const { domain } = SITE_IDENTITY;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      sameAs: `https://${domain}`,
    },
    url: `https://${domain}${url}`,
  };
  return <JsonLd data={data} />;
}

export function ExamJsonLd({
  name,
  description,
  url,
  date,
}: {
  name: string;
  description: string;
  url: string;
  date?: string;
}) {
  const { domain } = SITE_IDENTITY;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url: `https://${domain}${url}`,
    eventType: "EducationEvent",
    ...(date && { startDate: date }),
  };
  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  const { domain } = SITE_IDENTITY;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://${domain}${url}`,
    ...(image && { image: image.startsWith("http") ? image : `https://${domain}${image}` }),
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author || SITE_IDENTITY.meta.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_IDENTITY.name,
      logo: {
        "@type": "ImageObject",
        url: `https://${domain}/logo.png`,
      },
    },
  };
  return <JsonLd data={data} />;
}

export function FAQJsonLd({ questions }: { questions: { question: string; answer: string }[] }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
  return <JsonLd data={data} />;
}
