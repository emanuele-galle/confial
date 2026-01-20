import Link from "next/link";
import Image from "next/image";
import { FileText, ChevronLeft, CheckCircle2, ArrowRight, Target, TrendingUp, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const obiettivi = [
  {
    icon: TrendingUp,
    title: "Difesa dei salari reali",
    description: "Incremento delle retribuzioni per tutelare il potere d'acquisto dei lavoratori",
  },
  {
    icon: Target,
    title: "Inquadramenti professionali",
    description: "Aggiornamento alle nuove competenze digitali e tecniche richieste dal mercato",
  },
  {
    icon: Shield,
    title: "Salute e sicurezza",
    description: "Rafforzamento delle clausole su prevenzione, protezione e ambiente di lavoro",
  },
  {
    icon: Users,
    title: "Tutela delle fasce deboli",
    description: "Maggiore protezione per giovani, precari, somministrati e lavoratori in appalto",
  },
];

const ccnl = [
  "CCNL Metalmeccanici Industria",
  "CCNL Metalmeccanici PMI",
  "CCNL Siderurgia",
  "CCNL Installazione impianti",
  "CCNL Oreficeria e argenteria",
  "CCNL Fonderie",
];

export default function ContrattazioneNazionalePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/settori/siderurgia.jpg"
            alt="Contrattazione nazionale"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
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
                  <FileText className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white">Contrattazione nazionale</h1>
                  <p className="text-white/70 mt-1 text-sm sm:text-base">CCNL dei settori metalmeccanici e siderurgici</p>
                </div>
              </div>
              <p className="text-sm sm:text-lg text-white/80 leading-relaxed">
                FAILMS partecipa, in ambito confederale, ai processi di negoziazione dei
                Contratti Collettivi Nazionali di Lavoro (CCNL) dei settori metalmeccanici,
                siderurgici e dei comparti collegati.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Obiettivi */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">I nostri obiettivi strategici</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Le priorità che portiamo al tavolo negoziale per tutelare i lavoratori del settore.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {obiettivi.map((obiettivo, index) => (
              <div key={index} className="flex gap-3 sm:gap-5 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-colors">
                <div className="w-10 sm:w-14 h-10 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <obiettivo.icon className="h-5 sm:h-7 w-5 sm:w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{obiettivo.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{obiettivo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CCNL */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Contratti di riferimento</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Operiamo nell&apos;ambito dei principali CCNL del settore industriale,
                garantendo rappresentanza e tutela ai lavoratori in tutti i comparti.
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {ccnl.map((contratto, index) => (
                  <li key={index} className="flex items-center text-gray-700 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="font-medium">{contratto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Altri livelli di contrattazione</h3>
              <div className="space-y-3 sm:space-y-4">
                <Link href="/contrattazione/secondo-livello" className="block p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 text-sm sm:text-base">Secondo livello</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Contrattazione territoriale e aziendale</p>
                    </div>
                    <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
                <Link href="/contrattazione/aziendale" className="block p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 text-sm sm:text-base">Aziendale</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Accordi nelle singole aziende</p>
                    </div>
                    <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-20 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Vuoi saperne di più sui tuoi diritti contrattuali?
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
            I nostri esperti sono a disposizione per illustrarti le tutele previste dal tuo CCNL.
          </p>
          <Link href="/contatti">
            <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-4 sm:py-6 font-bold rounded-xl text-sm sm:text-base">
              Contattaci
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
