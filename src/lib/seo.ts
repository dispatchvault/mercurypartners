// Search and answer-engine metadata for mercfund.com.
//
// This file is the single source of truth for the facts search engines and AI
// assistants read about Mercury Partners (structured data / JSON-LD). If a fact
// changes on the site — revenue range, address, phone, sectors, Brad's title —
// change it here too so the two never disagree.

export const SITE_URL = "https://mercfund.com";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BRAD_ID = `${SITE_URL}/about/#brad-de-koning`;

export const abs = (path: string) => new URL(path, SITE_URL).href;

/** Canonical URL for a page path: always absolute, always with a trailing slash. */
export const canonicalFor = (pathname: string) =>
  abs(pathname === "/" ? "/" : pathname.replace(/\/?$/, "/"));

export const ORG_DESCRIPTION =
  "Mercury Partners is a San Diego-based principal investment firm that invests its own permanent capital in founder-owned business services and healthcare services companies with $10 million to $50 million in revenue and $1 million to $4 million in EBITDA. It pursues majority or control investments involving founder transitions, recapitalizations, and management buyouts, with transaction sizes of $5 million to $50 million.";

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Mercury Partners",
  alternateName: "Mercury Partners, LLC",
  url: `${SITE_URL}/`,
  sameAs: ["https://www.linkedin.com/company/mercury-partners-llc"],
  logo: {
    "@type": "ImageObject",
    url: abs("/images/logo-blue.png"),
    width: 1045,
    height: 191,
  },
  image: abs("/images/og-mercury-partners.jpg"),
  description: ORG_DESCRIPTION,
  foundingDate: "1996",
  founder: { "@id": BRAD_ID },
  employee: { "@id": BRAD_ID },
  address: {
    "@type": "PostalAddress",
    streetAddress: "12544 High Bluff Drive, Suite 200",
    addressLocality: "San Diego",
    addressRegion: "CA",
    postalCode: "92130",
    addressCountry: "US",
  },
  telephone: "+1-858-205-1405",
  email: "contact@mercfund.com",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "New investment opportunities",
    telephone: "+1-858-205-1405",
    email: "contact@mercfund.com",
    areaServed: "US",
    availableLanguage: "English",
  },
  areaServed: { "@type": "Country", name: "United States" },
  knowsAbout: [
    "Private equity",
    "Permanent capital",
    "Lower middle market investing",
    "Founder transitions and succession",
    "Recapitalizations",
    "Management buyouts",
    "Business services",
    "Healthcare services",
    "Equipment maintenance and repair",
    "Testing, inspection, and calibration",
    "Medical equipment maintenance and repair",
    "Diagnostic imaging parts and services",
    "Sterilization and infection control",
  ],
};

const brad = {
  "@type": "Person",
  "@id": BRAD_ID,
  name: "Brad de Koning",
  givenName: "Brad",
  familyName: "de Koning",
  jobTitle: "Founding Partner",
  worksFor: { "@id": ORG_ID },
  url: abs("/about/"),
  image: abs("/images/brad-de-koning-blazer-grey.jpg"),
  description:
    "Brad de Koning is the Founding Partner of Mercury Partners, where he has led the firm's investment activities since 1996. He was CEO of DirectMed Imaging for nearly nine years following Mercury's acquisition of the company in 2017, and has served as both a private equity investor and CEO of two lower middle market companies.",
  sameAs: [
    "https://www.linkedin.com/in/brad-de-koning-478550a8/",
    "https://www.crunchbase.com/person/brad-de-koning",
  ],
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: "Mercury Partners",
  description: ORG_DESCRIPTION,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
};

type Crumb = { name: string; path: string };

export function breadcrumb(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: canonicalFor(c.path),
    })),
  };
}

export function faqPage(url: string, faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * The full JSON-LD graph for a page: the site-wide Organization, WebSite and
 * founder entities, the page itself, and any page-specific nodes.
 */
export function pageGraph(opts: {
  url: string;
  title: string;
  description: string;
  pageType?: string;
  crumbs?: Crumb[];
  mainEntity?: object;
  extra?: object[];
}) {
  const webPage: Record<string, unknown> = {
    "@type": opts.pageType ?? "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    primaryImageOfPage: { "@type": "ImageObject", url: abs("/images/og-mercury-partners.jpg") },
  };
  if (opts.crumbs?.length) webPage.breadcrumb = breadcrumb(opts.crumbs);
  if (opts.mainEntity) webPage.mainEntity = opts.mainEntity;

  return {
    "@context": "https://schema.org",
    "@graph": [organization, brad, website, webPage, ...(opts.extra ?? [])],
  };
}
