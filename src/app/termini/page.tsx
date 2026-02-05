import Link from "next/link";
import { ArrowLeft, FileText, Scale, Users, AlertTriangle, RefreshCw, Shield } from "lucide-react";

export const metadata = {
  title: "Termini e Condizioni - FAILMS CONFIAL",
  description: "Termini e condizioni di utilizzo del sito FAILMS CONFIAL - Sindacato Autonomo Metalmeccanici.",
};

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/10 rounded-xl">
              <FileText className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Termini e Condizioni
            </h1>
          </div>
          <p className="text-white/70 text-lg">
            Ultimo aggiornamento: Febbraio 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">

            {/* Intro */}
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                I presenti Termini e Condizioni regolano l&apos;utilizzo del sito web failms.org
                di FAILMS CONFIAL. L&apos;accesso e l&apos;utilizzo del sito implicano l&apos;accettazione
                dei presenti termini.
              </p>

              {/* Sections */}
              <div className="space-y-10">

                {/* Section 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Oggetto</h2>
                    <p className="text-gray-600">
                      Il sito failms.org è gestito da FAILMS CONFIAL - Federazione Autonoma
                      Italiana Lavoratori Metalmeccanici e Siderurgici, con sede in
                      Piazza Giuseppe Garibaldi n.39, 80143 Napoli (NA).
                      Il sito fornisce informazioni sull&apos;attività sindacale, i servizi
                      offerti e le iniziative di FAILMS CONFIAL.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Utilizzo del Sito</h2>
                    <p className="text-gray-600 mb-3">L&apos;utente si impegna a:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Utilizzare il sito in modo lecito e conforme ai presenti termini</li>
                      <li>Non diffondere contenuti illegali, offensivi o diffamatori</li>
                      <li>Non tentare di accedere ad aree riservate senza autorizzazione</li>
                      <li>Fornire dati veritieri nei moduli di contatto</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Scale className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. Proprietà Intellettuale</h2>
                    <p className="text-gray-600">
                      Tutti i contenuti del sito (testi, immagini, loghi, video, grafica) sono
                      di proprietà di FAILMS CONFIAL o dei rispettivi titolari e sono protetti
                      dalle leggi sul diritto d&apos;autore. È vietata la riproduzione, distribuzione
                      o modifica dei contenuti senza autorizzazione scritta.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Limitazione di Responsabilità</h2>
                    <p className="text-gray-600">
                      FAILMS CONFIAL si impegna a mantenere le informazioni del sito accurate e aggiornate,
                      ma non garantisce la completezza o l&apos;esattezza dei contenuti. Il sito è fornito
                      &quot;così com&apos;è&quot;, senza garanzie di alcun tipo. FAILMS CONFIAL non è responsabile
                      per eventuali danni derivanti dall&apos;utilizzo del sito o dall&apos;impossibilità
                      di accedervi.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">5. Modifiche ai Termini</h2>
                    <p className="text-gray-600">
                      FAILMS CONFIAL si riserva il diritto di modificare i presenti Termini e Condizioni
                      in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina e la data
                      di ultimo aggiornamento verrà aggiornata di conseguenza. L&apos;utilizzo continuato
                      del sito dopo le modifiche costituisce accettazione dei nuovi termini.
                    </p>
                  </div>
                </div>

                {/* Section 6 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Scale className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">6. Legge Applicabile e Foro Competente</h2>
                    <p className="text-gray-600">
                      I presenti Termini e Condizioni sono regolati dalla legge italiana.
                      Per qualsiasi controversia sarà competente il Foro di Napoli.
                    </p>
                  </div>
                </div>

                {/* Section 7 - Sviluppo */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">7. Sviluppo e Gestione Tecnica del Sito</h2>
                    <p className="text-gray-600">Questo sito web è stato realizzato e viene gestito da:</p>
                    <p className="text-gray-600 mt-2">
                      <strong>FODI S.r.l. – Startup Innovativa</strong><br />
                      Via Santicelli 18/A, 88068 Soverato (CZ)<br />
                      P.IVA: 03856160793<br />
                      Email: <a href="mailto:info@fodisrl.it" className="text-emerald-600 hover:underline">info@fodisrl.it</a><br />
                      Tel: +39 0963 576433<br />
                      Web: <a href="https://www.fodisrl.it" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">www.fodisrl.it</a>
                    </p>
                  </div>
                </div>

              </div>

              {/* Contact */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-gray-600">
                  Per domande sui presenti Termini e Condizioni, contattaci all&apos;indirizzo{" "}
                  <a href="mailto:failms.nazionale@confial.it" className="text-emerald-600 hover:underline">
                    failms.nazionale@confial.it
                  </a>
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
