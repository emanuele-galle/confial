import Link from "next/link";
import Image from "next/image";
import { Calculator, ChevronLeft, CheckCircle2, ArrowRight, Phone, Clock, FileText, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStaticPageMetadata } from '@/lib/seo';

export const metadata = getStaticPageMetadata('/servizi/caf');

const servizi = [
  {
    title: "Dichiarazione dei redditi",
    items: [
      "Compilazione e invio modello 730",
      "Modello Redditi PF (ex Unico)",
      "Dichiarazioni integrative e correttive",
    ],
  },
  {
    title: "ISEE e prestazioni sociali",
    items: [
      "Calcolo ISEE ordinario e corrente",
      "ISEE universitario",
      "DSU per bonus e agevolazioni",
    ],
  },
  {
    title: "Tributi e imposte",
    items: [
      "IMU, TASI e tributi locali",
      "Calcolo e ravvedimento operoso",
      "Assistenza su cartelle esattoriali",
    ],
  },
  {
    title: "Altre pratiche",
    items: [
      "RED e dichiarazioni obbligatorie",
      "Successioni",
      "Contratti di locazione",
    ],
  },
];

const vantaggi = [
  { icon: Euro, title: "Tariffe agevolate", desc: "Prezzi convenzionati per gli iscritti FAILMS" },
  { icon: Clock, title: "Appuntamenti rapidi", desc: "Disponibilità anche in orari serali" },
  { icon: FileText, title: "Pratiche complete", desc: "Gestione dalla A alla Z di ogni pratica" },
];

export default function CafPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/servizi/caf-dichiarazione-redditi.jpg"
            alt="Servizi CAF"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>

        <div className="relative z-10 min-h-[40vh] sm:min-h-[50vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-20 sm:py-32 w-full">
            {/* Breadcrumb */}
            <Link
              href="/servizi"
              className="inline-flex items-center text-white/70 hover:text-white mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Torna ai servizi
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Calculator className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white">
                      Servizi fiscali (CAF)
                    </h1>
                    <p className="text-white/70 mt-1 text-sm sm:text-base">Centro Assistenza Fiscale</p>
                  </div>
                </div>
                <p className="text-sm sm:text-lg text-white/80 leading-relaxed">
                  Supportiamo iscritti e cittadinanza nelle principali pratiche fiscali,
                  offrendo un servizio professionale e competente per semplificare
                  gli adempimenti e ottimizzare i benefici economici.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link href="/contatti">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-4 sm:py-6 font-bold rounded-xl shadow-lg group text-sm sm:text-base">
                    Prenota appuntamento
                    <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="py-8 sm:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {vantaggi.map((v, i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <v.icon className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">{v.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servizi dettaglio */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">I nostri servizi fiscali</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Un&apos;offerta completa per rispondere a tutte le tue esigenze fiscali e tributarie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {servizi.map((categoria, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
                  {categoria.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {categoria.items.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-700 text-sm sm:text-base">
                      <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Hai bisogno di assistenza fiscale?
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
            Prenota un appuntamento presso la sede più vicina a te.
            I nostri operatori sono a tua disposizione.
          </p>
          <Link href="/contatti">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-xl text-sm sm:text-base">
              <Phone className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Contattaci
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
