// Using native <script> instead of next/script to ensure JSON-LD
// is in the initial HTML (not loaded via JS after hydration)

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://failms.org';

// Organization schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FAILMS - CONFIAL',
  alternateName: 'Federazione Autonoma Italiana Lavoratori Metalmeccanici e Siderurgici',
  url: BASE_URL,
  logo: `${BASE_URL}/icons/icon-512x512.png`,
  image: `${BASE_URL}/images/logo-failms-new.png`,
  description:
    "Il sindacato dell'industria metalmeccanica e siderurgica che difende i diritti, governa le transizioni e costruisce futuro nei luoghi di lavoro. FAILMS aderisce a CONFIAL.",
  foundingDate: '1984',
  parentOrganization: {
    '@type': 'Organization',
    name: 'CONFIAL',
    alternateName: 'Confederazione Italiana Autonoma Lavoratori',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Italian'],
    },
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Italy',
  },
  knowsAbout: [
    'Contrattazione collettiva',
    'Diritti dei lavoratori',
    'Industria metalmeccanica',
    'Industria siderurgica',
    'Sindacato autonomo',
    'Tutela del lavoro',
    'CAF',
    'Patronato',
  ],
};

// WebSite schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FAILMS - CONFIAL',
  url: BASE_URL,
  inLanguage: 'it',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/news?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ProfessionalService schema (for local SEO)
const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'FAILMS - Servizi ai Lavoratori',
  image: `${BASE_URL}/icons/icon-512x512.png`,
  '@id': `${BASE_URL}/#professional-service`,
  url: BASE_URL,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IT',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servizi FAILMS CONFIAL',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Servizi Fiscali (CAF)',
          description: 'Dichiarazioni dei redditi, ISEE, bonus fiscali e assistenza tributaria',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Patronato',
          description: 'Pensioni, infortuni sul lavoro, malattia e prestazioni previdenziali',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Consulenza Legale',
          description: 'Diritto del lavoro, vertenze sindacali e tutela legale',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Vertenze di Lavoro',
          description: 'Recupero crediti, cause di lavoro e assistenza nelle controversie',
        },
      },
    ],
  },
};

export function OrganizationStructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}

