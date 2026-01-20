import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - FAILMS CONFIAL",
  description: "Informativa sulla privacy e trattamento dei dati personali di FAILMS CONFIAL - Sindacato Autonomo Metalmeccanici.",
};

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-white/70 text-lg">
            Ultimo aggiornamento: Dicembre 2025
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
                FAILMS CONFIAL (di seguito &quot;Titolare&quot;) si impegna a proteggere la privacy dei visitatori
                del proprio sito web e degli iscritti al sindacato. La presente informativa descrive
                le modalità di trattamento dei dati personali raccolti.
              </p>

              {/* Sections */}
              <div className="space-y-10">

                {/* Section 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Database className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Titolare del Trattamento</h2>
                    <p className="text-gray-600">
                      Il Titolare del trattamento dei dati personali è FAILMS CONFIAL - Federazione Autonoma
                      Italiana Lavoratori Metalmeccanici e Siderurgici, con sede in Via Roma 123, 80100 Napoli (NA).
                    </p>
                    <p className="text-gray-600 mt-2">
                      Email: <a href="mailto:privacy@confial.it" className="text-emerald-600 hover:underline">privacy@confial.it</a>
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Dati Raccolti</h2>
                    <p className="text-gray-600 mb-3">Raccogliamo le seguenti categorie di dati:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li><strong>Dati di navigazione:</strong> indirizzo IP, browser, pagine visitate, tempi di permanenza</li>
                      <li><strong>Dati forniti volontariamente:</strong> nome, email, telefono, azienda (tramite form contatti)</li>
                      <li><strong>Dati degli iscritti:</strong> dati anagrafici, lavorativi e fiscali necessari per l&apos;erogazione dei servizi sindacali</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Lock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalità del Trattamento</h2>
                    <p className="text-gray-600 mb-3">I dati personali sono trattati per:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Rispondere alle richieste di informazioni</li>
                      <li>Erogare i servizi sindacali (CAF, Patronato, assistenza legale)</li>
                      <li>Inviare comunicazioni relative all&apos;attività sindacale (previo consenso)</li>
                      <li>Adempiere agli obblighi di legge</li>
                      <li>Migliorare l&apos;esperienza di navigazione del sito</li>
                    </ul>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Base Giuridica</h2>
                    <p className="text-gray-600">
                      Il trattamento dei dati si basa su: consenso dell&apos;interessato, esecuzione di un contratto
                      o misure precontrattuali, adempimento di obblighi legali, legittimo interesse del Titolare
                      (es. sicurezza informatica, miglioramento servizi).
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">5. Diritti dell&apos;Interessato</h2>
                    <p className="text-gray-600 mb-3">Ai sensi degli artt. 15-22 del GDPR, hai diritto di:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Accedere ai tuoi dati personali</li>
                      <li>Richiedere la rettifica o la cancellazione</li>
                      <li>Limitare o opporti al trattamento</li>
                      <li>Richiedere la portabilità dei dati</li>
                      <li>Revocare il consenso in qualsiasi momento</li>
                      <li>Proporre reclamo al Garante Privacy</li>
                    </ul>
                  </div>
                </div>

                {/* Section 6 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contatti</h2>
                    <p className="text-gray-600">
                      Per esercitare i tuoi diritti o per qualsiasi informazione sul trattamento dei dati,
                      puoi contattarci all&apos;indirizzo email{" "}
                      <a href="mailto:privacy@confial.it" className="text-emerald-600 hover:underline">
                        privacy@confial.it
                      </a>{" "}
                      o scrivere a FAILMS CONFIAL, Via Roma 123, 80100 Napoli (NA).
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
