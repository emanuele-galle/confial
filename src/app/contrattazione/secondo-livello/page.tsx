import Link from "next/link";
import Image from "next/image";
import { Building2, ChevronLeft, CheckCircle2, ArrowRight, Briefcase, Clock, Gift, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

const aree = [
  {
    icon: Gift,
    title: "Premio di risultato",
    description: "Sistemi incentivanti trasparenti legati alla produttività aziendale",
  },
  {
    icon: Clock,
    title: "Orario e flessibilità",
    description: "Turnazioni, flessibilità e conciliazione vita-lavoro",
  },
  {
    icon: Briefcase,
    title: "Welfare aziendale",
    description: "Sanità integrativa, previdenza, servizi alla famiglia",
  },
  {
    icon: Laptop,
    title: "Smart working",
    description: "Regolazione delle nuove forme di organizzazione del lavoro",
  },
];

const vantaggi = [
  "Premi di risultato e sistemi incentivanti sostenibili e trasparenti",
  "Orario di lavoro, turni, flessibilità e conciliazione vita-lavoro",
  "Welfare aziendale e benefit (sanità integrativa, previdenza, servizi alla famiglia)",
  "Regolazione di smart working e nuove forme di organizzazione del lavoro",
  "Partecipazione dei lavoratori ai processi di cambiamento organizzativo",
];

export default function SecondoLivelloPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/settori/automotive.jpg"
            alt="Contrattazione secondo livello"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/70" />
        </div>

        <div className="relative z-10 min-h-[40vh] sm:min-h-[50vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-20 sm:py-32 w-full">
            <Link href="/contrattazione" className="inline-flex items-center text-white/70 hover:text-white mb-6 sm:mb-8 transition-colors text-sm sm:text-base">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Torna a contrattazione
            </Link>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Building2 className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white">Secondo livello</h1>
                  <p className="text-white/70 mt-1 text-sm sm:text-base">Contrattazione aziendale e territoriale</p>
                </div>
              </div>
              <p className="text-sm sm:text-lg text-white/80 leading-relaxed">
                A livello aziendale e territoriale, FAILMS promuove contrattazione di prossimità
                centrata sulle esigenze specifiche dei lavoratori e delle imprese.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aree di intervento */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Aree di intervento</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Le principali tematiche su cui operiamo nella contrattazione di secondo livello.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {aree.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-emerald-50 transition-colors text-center">
                <div className="w-10 sm:w-14 h-10 sm:h-14 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <area.icon className="h-5 sm:h-7 w-5 sm:w-7 text-emerald-600" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{area.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dettagli */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Cosa negoziamo</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                La contrattazione di secondo livello integra le tutele previste dal CCNL
                con accordi specifici che rispondono alle esigenze del territorio e delle aziende.
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {vantaggi.map((vantaggio, index) => (
                  <li key={index} className="flex items-start text-gray-700 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    {vantaggio}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Altri livelli di contrattazione</h3>
              <div className="space-y-3 sm:space-y-4">
                <Link href="/contrattazione/nazionale" className="block p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 text-sm sm:text-base">Nazionale</h4>
                      <p className="text-xs sm:text-sm text-gray-600">CCNL e negoziazione confederale</p>
                    </div>
                    <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </Link>
                <Link href="/contrattazione/aziendale" className="block p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 text-sm sm:text-base">Aziendale</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Accordi nelle singole aziende</p>
                    </div>
                    <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-20 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Vuoi migliorare le condizioni nella tua azienda?
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
            I nostri delegati sono pronti ad ascoltare le tue esigenze e negoziare accordi vantaggiosi.
          </p>
          <Link href="/contatti">
            <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-gray-100 px-6 sm:px-8 py-4 sm:py-6 font-bold rounded-xl text-sm sm:text-base">
              Contattaci
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
