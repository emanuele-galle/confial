import Link from "next/link";
import { ArrowLeft, Cookie, Settings, BarChart3, Share2, Shield } from "lucide-react";

export const metadata = {
  title: "Cookie Policy - FAILMS CONFIAL",
  description: "Informativa sui cookie utilizzati dal sito FAILMS CONFIAL - Sindacato Autonomo Metalmeccanici.",
};

export default function CookiePage() {
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
              <Cookie className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Cookie Policy
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
                Questa Cookie Policy spiega cosa sono i cookie, quali tipologie utilizziamo
                sul sito failms.org e come puoi gestire le tue preferenze.
              </p>

              {/* Sections */}
              <div className="space-y-10">

                {/* Section 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Cookie className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Cosa sono i Cookie</h2>
                    <p className="text-gray-600">
                      I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo
                      quando visiti un sito web. Servono a migliorare l&apos;esperienza di navigazione,
                      ricordare le tue preferenze e raccogliere informazioni statistiche anonime.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Settings className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cookie Tecnici (Necessari)</h2>
                    <p className="text-gray-600 mb-3">
                      Questi cookie sono essenziali per il funzionamento del sito e non possono essere disattivati:
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mt-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="pb-2">Nome</th>
                            <th className="pb-2">Durata</th>
                            <th className="pb-2">Scopo</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          <tr>
                            <td className="py-1 font-mono text-xs">__next_*</td>
                            <td className="py-1">Sessione</td>
                            <td className="py-1">Funzionamento Next.js</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-mono text-xs">cookie_consent</td>
                            <td className="py-1">1 anno</td>
                            <td className="py-1">Preferenze cookie</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookie Analitici</h2>
                    <p className="text-gray-600 mb-3">
                      Utilizziamo cookie analitici per comprendere come i visitatori interagiscono con il sito.
                      Tutti i dati sono raccolti in forma anonima e aggregata.
                    </p>
                    <p className="text-gray-600">
                      Attualmente non utilizziamo servizi di analytics di terze parti. In futuro,
                      potremmo implementare soluzioni privacy-friendly come Plausible o Umami.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookie di Terze Parti</h2>
                    <p className="text-gray-600 mb-3">
                      Il sito potrebbe includere contenuti di terze parti che impostano propri cookie:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li><strong>Vimeo:</strong> Per la riproduzione dei video nella sezione WebTV</li>
                      <li><strong>Google Fonts:</strong> Per il caricamento dei font (Inter, Space Grotesk)</li>
                    </ul>
                    <p className="text-gray-600 mt-3">
                      Ti invitiamo a consultare le rispettive privacy policy per maggiori informazioni.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">5. Come Gestire i Cookie</h2>
                    <p className="text-gray-600 mb-3">
                      Puoi gestire le tue preferenze sui cookie in diversi modi:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li><strong>Impostazioni del browser:</strong> Tutti i browser permettono di bloccare o eliminare i cookie</li>
                      <li><strong>Navigazione privata:</strong> I cookie vengono eliminati alla chiusura della sessione</li>
                    </ul>
                    <p className="text-gray-600 mt-3">
                      <strong>Nota:</strong> Disabilitare i cookie tecnici potrebbe compromettere alcune funzionalità del sito.
                    </p>
                  </div>
                </div>

                {/* Links to browser settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Link utili per la gestione cookie:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        Safari
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Section 6 - Sviluppo */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">6. Sviluppo e Gestione Tecnica del Sito</h2>
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
                  Per domande sulla presente Cookie Policy, contattaci all&apos;indirizzo{" "}
                  <a href="mailto:privacy@confial.it" className="text-emerald-600 hover:underline">
                    privacy@confial.it
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
