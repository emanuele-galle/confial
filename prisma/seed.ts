import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

console.log("Connecting to database...");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("AdminConfial2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@confial.it" },
    update: {},
    create: {
      email: "admin@confial.it",
      name: "Amministratore",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);
  console.log("📧 Email: admin@confial.it");
  console.log("🔑 Password: AdminConfial2026!");
  console.log("⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN\n");

  // ==================== NEWS ====================
  console.log("📰 Creating news articles...");

  const newsArticles = [
    {
      title: "Rinnovato il Contratto Collettivo Nazionale Metalmeccanici 2026",
      slug: "rinnovo-ccnl-metalmeccanici-2026",
      excerpt:
        "Raggiunto l'accordo per il rinnovo del CCNL Metalmeccanici con aumenti salariali significativi e nuove tutele per i lavoratori.",
      content: `
<h2>Raggiunto l'accordo storico</h2>
<p>Dopo mesi di negoziazioni, FAILMS ha raggiunto un accordo importante con le associazioni datoriali per il rinnovo del Contratto Collettivo Nazionale dei Metalmeccanici.</p>

<h3>Principali novità:</h3>
<ul>
  <li>Aumento salariale medio di 250€ mensili distribuito in 4 tranche</li>
  <li>Nuove tutele per la conciliazione vita-lavoro</li>
  <li>Potenziamento della formazione professionale continua</li>
  <li>Maggiori garanzie in tema di salute e sicurezza</li>
</ul>

<p>L'accordo rappresenta un risultato importante per tutti i lavoratori del settore e testimonia l'impegno costante di FAILMS nella difesa dei diritti dei metalmeccanici italiani.</p>
      `,
      status: "PUBLISHED" as const,
      featured: true,
      publishedAt: new Date("2026-01-15"),
      authorId: admin.id,
    },
    {
      title: "Assemblea Nazionale FAILMS: Approvato il Piano Strategico 2026-2028",
      slug: "assemblea-nazionale-piano-strategico",
      excerpt:
        "L'assemblea nazionale ha approvato all'unanimità il piano strategico triennale con focus su innovazione, formazione e tutele.",
      content: `
<h2>Obiettivi strategici per il triennio</h2>
<p>L'assemblea nazionale FAILMS, riunitasi a Roma il 10 gennaio 2026, ha approvato con voto unanime il Piano Strategico 2026-2028.</p>

<h3>Assi prioritari:</h3>
<ol>
  <li><strong>Innovazione digitale:</strong> Piattaforme online per servizi ai lavoratori</li>
  <li><strong>Formazione continua:</strong> Partnership con enti formativi accreditati</li>
  <li><strong>Tutele rafforzate:</strong> Assistenza legale e consulenza specializzata</li>
  <li><strong>Sostenibilità:</strong> Impegno per la transizione ecologica del settore</li>
</ol>

<p>Il piano prevede investimenti significativi in tecnologia e risorse umane per garantire un servizio sempre più efficace ai nostri iscritti.</p>
      `,
      status: "PUBLISHED" as const,
      featured: true,
      publishedAt: new Date("2026-01-12"),
      authorId: admin.id,
    },
    {
      title: "Nuovi Sportelli di Assistenza FAILMS sul Territorio",
      slug: "nuovi-sportelli-assistenza",
      excerpt:
        "Inaugurati 15 nuovi sportelli in tutta Italia per garantire assistenza di prossimità ai lavoratori metalmeccanici.",
      content: `
<h2>Presidio capillare del territorio</h2>
<p>FAILMS rafforza la propria presenza sul territorio nazionale con l'apertura di 15 nuovi sportelli di assistenza distribuiti in tutte le regioni.</p>

<p>Gli sportelli offrono:</p>
<ul>
  <li>Consulenza contrattuale e normativa</li>
  <li>Assistenza nelle vertenze individuali</li>
  <li>Informazioni su diritti e opportunità</li>
  <li>Supporto per pratiche amministrative</li>
</ul>

<p>Gli orari e le sedi sono disponibili nella sezione "Contatti" del sito.</p>
      `,
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2026-01-08"),
      authorId: admin.id,
    },
    {
      title: "Sicurezza sul Lavoro: Nuove Linee Guida per il Settore Metalmeccanico",
      slug: "sicurezza-lavoro-linee-guida",
      excerpt:
        "Pubblicate le nuove linee guida ministeriali sulla sicurezza nei luoghi di lavoro del settore metalmeccanico.",
      content: `
<h2>Prevenzione e formazione</h2>
<p>Il Ministero del Lavoro ha pubblicato le nuove linee guida per la sicurezza nel settore metalmeccanico, frutto del lavoro congiunto con le parti sociali, tra cui FAILMS.</p>

<h3>Principali novità normative:</h3>
<ul>
  <li>Rafforzamento dei protocolli di prevenzione infortuni</li>
  <li>Obbligo di formazione continua certificata</li>
  <li>Nuovi standard per i dispositivi di protezione individuale</li>
  <li>Maggiori controlli sugli ambienti di lavoro</li>
</ul>

<p>FAILMS ha predisposto corsi di formazione specifici per RLS e RSPP. Informazioni nella sezione "Formazione".</p>
      `,
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2026-01-05"),
      authorId: admin.id,
    },
    {
      title: "Welfare Aziendale: Guida alle Nuove Opportunità per i Lavoratori",
      slug: "welfare-aziendale-guida",
      excerpt:
        "Una guida completa alle opportunità di welfare aziendale disponibili per i lavoratori metalmeccanici.",
      content: `
<h2>Massimizza i benefici del welfare</h2>
<p>Il welfare aziendale rappresenta un importante elemento retributivo. FAILMS ha preparato una guida completa per orientare i lavoratori nelle scelte più vantaggiose.</p>

<h3>Servizi accessibili:</h3>
<ul>
  <li>Rimborsi spese sanitarie e assistenza familiare</li>
  <li>Contributi per istruzione e formazione</li>
  <li>Buoni acquisto per beni e servizi</li>
  <li>Previdenza complementare</li>
</ul>

<p>Scarica la guida completa nella sezione "Documenti".</p>
      `,
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2025-12-28"),
      authorId: admin.id,
    },
    {
      title: "BOZZA: Proposta Modifica Regolamento Interno",
      slug: "bozza-modifica-regolamento",
      excerpt:
        "Proposta di modifica del regolamento interno in fase di discussione. Consultazione aperta fino al 15 febbraio.",
      content: `
<h2>Consultazione aperta</h2>
<p><strong>ATTENZIONE: Questo documento è in bozza e soggetto a modifiche.</strong></p>

<p>La segreteria nazionale ha predisposto una proposta di modifica del regolamento interno per adeguarlo alle nuove esigenze organizzative.</p>

<h3>Principali modifiche proposte:</h3>
<ul>
  <li>Aggiornamento modalità assemblee (inclusa partecipazione online)</li>
  <li>Revisione quote associative</li>
  <li>Nuove procedure per l'elezione delle cariche</li>
</ul>

<p>Gli iscritti possono inviare osservazioni entro il 15 febbraio 2026 all'indirizzo segreteria@failms.org</p>
      `,
      status: "DRAFT" as const,
      featured: false,
      publishedAt: null,
      authorId: admin.id,
    },
    {
      title: "BOZZA: Report Attività 2025 - Dati Preliminari",
      slug: "bozza-report-attivita-2025",
      excerpt:
        "Report preliminare delle attività svolte nel 2025. Dati in fase di verifica prima della pubblicazione ufficiale.",
      content: `
<h2>Report preliminare</h2>
<p><strong>NOTA: Dati in fase di verifica - Non diffondere</strong></p>

<h3>Attività 2025 (dati parziali):</h3>
<ul>
  <li>Vertenze seguite: circa 450</li>
  <li>Nuovi iscritti: stimati 1.200</li>
  <li>Corsi di formazione erogati: 35</li>
  <li>Assemblee territoriali: 78</li>
</ul>

<p>Il report definitivo sarà pubblicato dopo la verifica dei dati e l'approvazione del comitato esecutivo.</p>
      `,
      status: "DRAFT" as const,
      featured: false,
      publishedAt: null,
      authorId: admin.id,
    },
  ];

  for (const article of newsArticles) {
    await prisma.news.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log(`✅ Created ${newsArticles.length} news articles\n`);

  // ==================== EVENTS ====================
  console.log("📅 Creating events...");

  const events = [
    {
      title: "Assemblea Regionale Lombardia - Piano Contrattuale 2026",
      slug: "assemblea-lombardia-marzo-2026",
      description: `
Assemblea regionale aperta a tutti gli iscritti FAILMS della Lombardia per discutere le strategie contrattuali del 2026 e le priorità territoriali.

**Ordine del giorno:**
- Rinnovo contratti aziendali
- Situazione settore automotive lombardo
- Iniziative formazione professionale
- Varie ed eventuali

La partecipazione è gratuita previa registrazione.
      `,
      eventDate: new Date("2026-03-15T09:30:00"),
      eventTime: "09:30 - 13:00",
      location: "Hotel Michelangelo, Milano",
      address: "Via Scarlatti 33, 20124 Milano",
      status: "PUBLISHED" as const,
      featured: true,
      registrationOpen: true,
      maxParticipants: 200,
    },
    {
      title: "Corso di Formazione: Rappresentante dei Lavoratori per la Sicurezza (RLS)",
      slug: "corso-rls-febbraio-2026",
      description: `
Corso di 32 ore per l'abilitazione come Rappresentante dei Lavoratori per la Sicurezza (RLS) secondo il D.Lgs. 81/2008.

**Programma:**
- Normativa sicurezza sul lavoro
- Valutazione dei rischi
- Diritti e doveri del RLS
- Comunicazione e relazioni sindacali
- Esercitazioni pratiche

Il corso è riconosciuto e rilascia attestato valido ai sensi di legge.

**Costo:** Gratuito per iscritti FAILMS
      `,
      eventDate: new Date("2026-02-20T09:00:00"),
      eventTime: "09:00 - 17:00 (4 giornate)",
      location: "Sede FAILMS Roma",
      address: "Via dei Metallurgici 45, 00100 Roma",
      status: "PUBLISHED" as const,
      featured: true,
      registrationOpen: true,
      maxParticipants: 30,
    },
    {
      title: "Manifestazione Nazionale per il Lavoro Dignitoso",
      slug: "manifestazione-nazionale-maggio-2026",
      description: `
Manifestazione nazionale indetta da FAILMS e altre sigle sindacali per rivendicare salari equi, sicurezza sul lavoro e stabilità occupazionale.

**Richieste:**
- Aumento salariale in linea con l'inflazione
- Stop a morti sul lavoro
- Stabilizzazione precari
- Tutela industria nazionale

Pullman organizzati da tutte le sedi provinciali. Informazioni presso gli sportelli territoriali.
      `,
      eventDate: new Date("2026-05-01T10:00:00"),
      eventTime: "10:00 - 16:00",
      location: "Piazza del Popolo, Roma",
      address: "Piazza del Popolo, 00187 Roma",
      status: "PUBLISHED" as const,
      featured: true,
      registrationOpen: false,
      maxParticipants: null,
    },
    {
      title: "Webinar: Nuove Norme Welfare Aziendale 2026",
      slug: "webinar-welfare-gennaio-2026",
      description: `
Webinar gratuito dedicato alle novità normative in tema di welfare aziendale introdotte dalla Legge di Bilancio 2026.

**Argomenti trattati:**
- Novità legislative
- Fringe benefit e tassazione
- Previdenza complementare
- Assistenza sanitaria integrativa
- Domande e risposte

Relatori: esperti fiscalisti e consulenti del lavoro

**Modalità:** Online su piattaforma Zoom
**Link:** Sarà inviato via email agli iscritti
      `,
      eventDate: new Date("2026-01-30T18:00:00"),
      eventTime: "18:00 - 20:00",
      location: "Online (Zoom)",
      address: null,
      status: "PUBLISHED" as const,
      featured: false,
      registrationOpen: true,
      maxParticipants: 500,
    },
    {
      title: "Incontro con le Aziende del Settore Automotive - Crisi e Prospettive",
      slug: "incontro-automotive-aprile-2026",
      description: `
Tavolo di confronto tra FAILMS, aziende del settore automotive e istituzioni per affrontare la crisi del comparto e individuare soluzioni condivise.

**Temi:**
- Impatto transizione elettrica sull'occupazione
- Riconversione professionale lavoratori
- Incentivi statali e regionali
- Investimenti in ricerca e sviluppo

La partecipazione è riservata a delegati aziendali e rappresentanti FAILMS.
      `,
      eventDate: new Date("2026-04-10T14:30:00"),
      eventTime: "14:30 - 18:00",
      location: "Confindustria, Torino",
      address: "Via Fanti 17, 10128 Torino",
      status: "PUBLISHED" as const,
      featured: false,
      registrationOpen: false,
      maxParticipants: 50,
    },
    {
      title: "Sportello di Consulenza Contrattuale e Previdenziale",
      slug: "sportello-consulenza-settimanale",
      description: `
Sportello di consulenza gratuita per iscritti FAILMS su tematiche contrattuali, previdenziali e assistenziali.

**Servizi offerti:**
- Lettura e interpretazione busta paga
- Calcolo TFR e contributi pensionistici
- Informazioni su permessi e congedi
- Orientamento previdenziale

**Modalità:** Su appuntamento (chiamare il numero 06.123456)

Tutti i mercoledì dalle 15:00 alle 19:00
      `,
      eventDate: new Date("2026-02-05T15:00:00"),
      eventTime: "15:00 - 19:00",
      location: "Sede FAILMS Milano",
      address: "Via Mecenate 76, 20138 Milano",
      status: "PUBLISHED" as const,
      featured: false,
      registrationOpen: false,
      maxParticipants: null,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log(`✅ Created ${events.length} events\n`);

  // ==================== DOCUMENTS ====================
  console.log("📄 Creating documents...");

  const documents = [
    {
      title: "Contratto Collettivo Nazionale Metalmeccanici 2024-2027",
      description:
        "Testo integrale del CCNL Metalmeccanici Industria rinnovato nel 2024, con tutti gli allegati e le tabelle salariali aggiornate.",
      filename: "CCNL_Metalmeccanici_2024-2027.pdf",
      filepath: "documents/ccnl-metalmeccanici-2024.pdf",
      fileSize: 2458624, // ~2.4 MB
      mimeType: "application/pdf",
      category: "Contratti",
      uploadedById: admin.id,
      downloadCount: 347,
    },
    {
      title: "Modulo Iscrizione FAILMS 2026",
      description:
        "Modulo per l'iscrizione al sindacato FAILMS. Compilare e inviare via email o consegnare presso uno sportello territoriale.",
      filename: "Modulo_Iscrizione_FAILMS_2026.pdf",
      filepath: "documents/modulo-iscrizione-2026.pdf",
      fileSize: 156824, // ~153 KB
      mimeType: "application/pdf",
      category: "Modulistica",
      uploadedById: admin.id,
      downloadCount: 892,
    },
    {
      title: "Guida ai Permessi Sindacali e Aspettative",
      description:
        "Guida completa sui permessi sindacali retribuiti, aspettative non retribuite e altre forme di tutela del tempo sindacale previste dalla legge e dai contratti.",
      filename: "Guida_Permessi_Sindacali.pdf",
      filepath: "documents/guida-permessi-sindacali.pdf",
      fileSize: 876543, // ~856 KB
      mimeType: "application/pdf",
      category: "Guide",
      uploadedById: admin.id,
      downloadCount: 234,
    },
    {
      title: "Tabelle Retributive Metalmeccanici - Aggiornamento Gennaio 2026",
      description:
        "Tabelle retributive aggiornate a gennaio 2026 con i minimi contrattuali per tutti i livelli e le indennità accessorie.",
      filename: "Tabelle_Retributive_Gen2026.pdf",
      filepath: "documents/tabelle-retributive-2026.pdf",
      fileSize: 345678, // ~337 KB
      mimeType: "application/pdf",
      category: "Contratti",
      uploadedById: admin.id,
      downloadCount: 521,
    },
    {
      title: "Comunicato Stampa - Rinnovo CCNL 15/01/2026",
      description:
        "Comunicato stampa ufficiale FAILMS sul rinnovo del Contratto Collettivo Nazionale Metalmeccanici sottoscritto il 15 gennaio 2026.",
      filename: "Comunicato_Rinnovo_CCNL_15gen2026.pdf",
      filepath: "documents/comunicato-rinnovo-ccnl.pdf",
      fileSize: 198432, // ~194 KB
      mimeType: "application/pdf",
      category: "Comunicati",
      uploadedById: admin.id,
      downloadCount: 156,
    },
    {
      title: "Modulo Richiesta Assistenza Legale",
      description:
        "Modulo per richiedere assistenza legale sindacale in caso di vertenze individuali o controversie con il datore di lavoro.",
      filename: "Modulo_Richiesta_Assistenza_Legale.pdf",
      filepath: "documents/modulo-assistenza-legale.pdf",
      fileSize: 123456, // ~121 KB
      mimeType: "application/pdf",
      category: "Modulistica",
      uploadedById: admin.id,
      downloadCount: 78,
    },
    {
      title: "Guida Welfare Aziendale 2026",
      description:
        "Guida pratica per orientarsi tra le opportunità di welfare aziendale: fringe benefit, previdenza complementare, assistenza sanitaria e servizi alla persona.",
      filename: "Guida_Welfare_Aziendale_2026.pdf",
      filepath: "documents/guida-welfare-2026.pdf",
      fileSize: 1234567, // ~1.2 MB
      mimeType: "application/pdf",
      category: "Guide",
      uploadedById: admin.id,
      downloadCount: 445,
    },
    {
      title: "Protocollo Sicurezza sul Lavoro - Settore Metalmeccanico",
      description:
        "Protocollo condiviso tra parti sociali per la sicurezza nei luoghi di lavoro del settore metalmeccanico, con particolare attenzione alla prevenzione infortuni.",
      filename: "Protocollo_Sicurezza_Metalmeccanici.pdf",
      filepath: "documents/protocollo-sicurezza.pdf",
      fileSize: 987654, // ~964 KB
      mimeType: "application/pdf",
      category: "Sicurezza",
      uploadedById: admin.id,
      downloadCount: 312,
    },
  ];

  for (const doc of documents) {
    await prisma.document.upsert({
      where: { filepath: doc.filepath },
      update: {},
      create: doc,
    });
  }

  console.log(`✅ Created ${documents.length} documents\n`);

  console.log("🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - 1 Admin user`);
  console.log(`   - ${newsArticles.length} News articles (${newsArticles.filter((n) => n.status === "PUBLISHED").length} published, ${newsArticles.filter((n) => n.status === "DRAFT").length} drafts)`);
  console.log(`   - ${events.length} Events`);
  console.log(`   - ${documents.length} Documents`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
