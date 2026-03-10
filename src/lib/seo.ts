import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://failms.org';

interface GeneratePageMetadataParams {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

function generatePageMetadata({
  title,
  description,
  pathname,
  image,
  noIndex = false,
  keywords,
}: GeneratePageMetadataParams): Metadata {
  const ogImage = image || '/images/hero-copertina.jpg';
  const url = `${BASE_URL}${pathname}`;

  const titleValue = title.includes('FAILMS') || title.includes('CONFIAL')
    ? { absolute: title }
    : title;

  return {
    title: titleValue,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'it_IT',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

type PageMetaContent = {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
};

const PAGE_META: Record<string, PageMetaContent> = {
  '/': {
    title: 'FAILMS - CONFIAL | Sindacato Industria Metalmeccanica e Siderurgica',
    description: "Il sindacato dell'industria che difende i diritti, governa le transizioni e costruisce futuro nei luoghi di lavoro. Oltre 40 anni di esperienza al servizio dei lavoratori metalmeccanici.",
    keywords: ['FAILMS', 'CONFIAL', 'sindacato', 'metalmeccanici', 'siderurgici', 'industria', 'lavoratori', 'contrattazione', 'diritti del lavoro'],
  },
  '/chi-siamo': {
    title: 'Chi Siamo - La Nostra Storia | FAILMS CONFIAL',
    description: 'Scopri la storia di FAILMS CONFIAL: dal 1984 al fianco dei lavoratori metalmeccanici e siderurgici. Autonomia, indipendenza e tutela dei diritti.',
    image: '/images/hero-copertina.jpg',
  },
  '/contatti': {
    title: 'Contatti | FAILMS CONFIAL',
    description: 'Contatta FAILMS CONFIAL per informazioni, adesione o assistenza. Siamo presenti su tutto il territorio nazionale con oltre 25 sedi.',
    keywords: ['contatti FAILMS', 'sedi sindacato', 'adesione sindacato', 'assistenza lavoratori'],
  },
  '/settori': {
    title: 'Settori Industriali | FAILMS CONFIAL',
    description: 'FAILMS è presente nei più importanti gruppi industriali italiani: grande industria, media impresa e piccole officine della filiera metalmeccanica e siderurgica.',
    keywords: ['settori industriali', 'metalmeccanico', 'siderurgico', 'grande industria', 'media impresa'],
  },
  '/news': {
    title: 'News e Aggiornamenti | FAILMS CONFIAL',
    description: 'Le ultime notizie su contrattazione, accordi sindacali, eventi e attività di FAILMS CONFIAL nel settore metalmeccanico e siderurgico.',
  },
  '/servizi': {
    title: 'I Nostri Servizi | FAILMS CONFIAL',
    description: 'FAILMS offre una piattaforma integrata di servizi: CAF, Patronato, consulenza legale, vertenze, sportello inquilinato e tutela consumatori.',
    keywords: ['servizi sindacato', 'CAF', 'patronato', 'consulenza legale', 'vertenze lavoro'],
  },
  '/servizi/caf': {
    title: 'Servizi Fiscali CAF | FAILMS CONFIAL',
    description: 'Centro di Assistenza Fiscale FAILMS: dichiarazioni dei redditi, ISEE, bonus fiscali e assistenza tributaria completa per lavoratori e famiglie.',
    keywords: ['CAF', 'dichiarazione redditi', 'ISEE', 'bonus fiscali', 'assistenza fiscale'],
  },
  '/servizi/patronato': {
    title: 'Patronato | FAILMS CONFIAL',
    description: 'Servizi di Patronato FAILMS: pensioni, infortuni sul lavoro, malattia, maternità e tutte le prestazioni previdenziali e assistenziali.',
    keywords: ['patronato', 'pensioni', 'infortuni lavoro', 'malattia', 'INPS', 'INAIL'],
  },
  '/servizi/legale': {
    title: 'Consulenza Legale | FAILMS CONFIAL',
    description: 'Assistenza legale specializzata in diritto del lavoro: licenziamenti, mobbing, discriminazioni e tutela dei diritti dei lavoratori.',
    keywords: ['consulenza legale', 'diritto del lavoro', 'licenziamento', 'mobbing', 'avvocato lavoro'],
  },
  '/servizi/inquilinato': {
    title: 'Sportello Inquilinato | FAILMS CONFIAL',
    description: "Assistenza per contratti di locazione, sfratti, controversie condominiali e tutela dell'inquilino. Sportello dedicato FAILMS.",
    keywords: ['inquilinato', 'affitto', 'contratto locazione', 'sfratto', 'diritti inquilino'],
  },
  '/servizi/consumatori': {
    title: 'Associazione Consumatori | FAILMS CONFIAL',
    description: 'Tutela dei consumatori: reclami, pratiche commerciali scorrette, truffe, contratti telefonici e assistenza acquisti.',
    keywords: ['tutela consumatori', 'reclami', 'pratiche scorrette', 'diritti consumatore'],
  },
  '/servizi/vertenze': {
    title: 'Vertenze di Lavoro | FAILMS CONFIAL',
    description: 'Assistenza nelle vertenze di lavoro: recupero crediti, TFR non pagato, differenze retributive e cause di lavoro.',
    keywords: ['vertenze lavoro', 'recupero crediti', 'TFR', 'cause lavoro', 'differenze retributive'],
  },
  '/servizi/istituto-studi': {
    title: 'Istituto Studi e Formazione | FAILMS CONFIAL',
    description: "Formazione sindacale, ricerca e studi sull'industria metalmeccanica. L'Istituto Studi FAILMS per la crescita professionale dei delegati.",
    keywords: ['formazione sindacale', 'istituto studi', 'ricerca lavoro', 'crescita professionale'],
  },
  '/contrattazione': {
    title: 'Contrattazione Collettiva | FAILMS CONFIAL',
    description: 'La contrattazione collettiva FAILMS: nazionale, di secondo livello e aziendale. Lo strumento centrale di tutela dei lavoratori.',
    keywords: ['contrattazione collettiva', 'CCNL', 'accordi sindacali', 'contratto lavoro'],
  },
  '/contrattazione/nazionale': {
    title: 'Contrattazione Nazionale | FAILMS CONFIAL',
    description: 'Contrattazione collettiva nazionale FAILMS nel settore metalmeccanico e siderurgico: CCNL, rinnovi e piattaforme rivendicative.',
    keywords: ['CCNL metalmeccanici', 'contratto nazionale', 'rinnovo contratto', 'sindacato nazionale'],
  },
  '/contrattazione/secondo-livello': {
    title: 'Contrattazione di Secondo Livello | FAILMS CONFIAL',
    description: 'Accordi integrativi aziendali e territoriali: welfare, premi di produttività, flessibilità oraria e smart working.',
    keywords: ['secondo livello', 'accordi integrativi', 'welfare aziendale', 'premio produttività'],
  },
  '/contrattazione/aziendale': {
    title: 'Contrattazione Aziendale | FAILMS CONFIAL',
    description: 'Negoziazione aziendale FAILMS: accordi su orari, turni, sicurezza, formazione e condizioni di lavoro nelle singole aziende.',
    keywords: ['contrattazione aziendale', 'accordi aziendali', 'RSU', 'delegati sindacali'],
  },
};

export function getStaticPageMetadata(pathname: string): Metadata {
  const pageMeta = PAGE_META[pathname];

  if (!pageMeta) {
    return generatePageMetadata({
      title: 'FAILMS - CONFIAL',
      description: "Il sindacato dell'industria metalmeccanica e siderurgica al servizio dei lavoratori.",
      pathname,
    });
  }

  return generatePageMetadata({
    title: pageMeta.title,
    description: pageMeta.description,
    pathname,
    image: pageMeta.image,
    keywords: pageMeta.keywords,
  });
}
