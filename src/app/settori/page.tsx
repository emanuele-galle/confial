"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Factory,
  Wrench,
  Truck,
  Users,
  Shield,
  Target,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Cog,
  Zap,
} from "lucide-react";
import {
  RevealOnScroll,
  GlowCard,
  FloatingElement,
  AnimatedCounter,
  TextReveal,
} from "@/components/ui/premium";

const settori = [
  {
    name: "Grande industria",
    icon: Building2,
    description: "Grandi gruppi metalmeccanici e siderurgici",
    image: "/images/settori/siderurgia.jpg",
    gradient: "from-blue-500 to-indigo-600",
    items: [
      "Grandi gruppi metalmeccanici e siderurgici",
      "Automotive e componentistica",
      "Impiantistica industriale e grandi manutenzioni",
      "Elettromeccanica, elettronica e automazione",
      "Cantieristica e grandi opere industriali",
    ],
    focus: [
      "Contrattazione di secondo livello complessa",
      "Piani industriali e riorganizzazioni",
      "Processi di fusione, acquisizione, delocalizzazione",
      "Accordi su orari, turni, premi di risultato, welfare aziendale",
    ],
  },
  {
    name: "Media impresa",
    icon: Factory,
    description: "Aziende metalmeccaniche strutturate a livello regionale",
    image: "/images/settori/automotive.jpg",
    gradient: "from-emerald-500 to-teal-600",
    items: [
      "Aziende metalmeccaniche strutturate a livello regionale",
      "Officine meccaniche industriali",
      "Aziende di carpenteria metallica",
      "Aziende di manutenzione e service industriale",
    ],
    focus: [
      "Tenuta occupazionale",
      "Definizione di premi variabili sostenibili",
      "Regolazione di flessibilità, banca ore, turnistica",
      "Gestione di crisi aziendali e ammortizzatori sociali",
    ],
  },
  {
    name: "Piccole imprese e indotto",
    icon: Wrench,
    description: "Il tessuto delle piccole realtà industriali",
    image: "/images/settori/officina-piccola.jpg",
    gradient: "from-amber-500 to-orange-600",
    items: [
      "Piccole officine",
      "Terzisti e subfornitori",
      "Micro-imprese dell'indotto dei grandi stabilimenti",
    ],
    focus: [
      "Assistenza diretta e personalizzata",
      "Supporto nei rapporti con le associazioni datoriali",
      "Tutela dei lavoratori esposti a instabilità e insicurezza",
    ],
  },
  {
    name: "Servizi collegati all'industria",
    icon: Truck,
    description: "Servizi di supporto al mondo industriale",
    image: "/images/settori/logistica-industriale.jpg",
    gradient: "from-purple-500 to-violet-600",
    items: [
      "Logistica interna di stabilimento",
      "Servizi di manutenzione impianti",
      "Servizi in appalto e multi-servizi industriali",
      "Pulizie industriali, guardiania, facility management",
    ],
    focus: [
      "Tutela nei rapporti di appalto",
      "Garantire pari dignità contrattuale",
      "Sicurezza e condizioni di lavoro",
    ],
  },
];

const stats = [
  { value: 4, suffix: "", label: "Settori principali", icon: Cog },
  { value: 20, suffix: "+", label: "Sotto-categorie", icon: Factory },
  { value: 2000, suffix: "+", label: "Lavoratori tutelati", icon: Users },
  { value: 100, suffix: "%", label: "Territorio coperto", icon: Zap },
];

export default function SettoriPage() {
  const [activeSettore, setActiveSettore] = useState(0);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero with background image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/settori/acciaieria-produzione.jpg"
            alt="Acciaieria"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement amplitude={15} speed={2} delay={0}>
            <div className="absolute top-20 left-[10%] w-64 h-64 bg-gradient-to-br from-[#018856]/30 to-emerald-500/20 rounded-full blur-3xl" />
          </FloatingElement>
          <FloatingElement amplitude={20} speed={1.5} delay={1}>
            <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-br from-blue-500/20 to-indigo-500/15 rounded-full blur-3xl" />
          </FloatingElement>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-emerald-300 mb-6">
              <Factory className="w-4 h-4" />
              I nostri settori
            </span>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              Settori che{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                rappresentiamo
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              FAILMS è presente nei più importanti gruppi industriali italiani e nelle filiere
              territoriali dell&apos;industria, coprendo l&apos;intero perimetro metalmeccanico e siderurgico.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <a
              href="#settori"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#018856] text-white rounded-xl font-medium hover:bg-[#016d45] transition-all duration-300 hover:shadow-lg hover:shadow-[#018856]/25 group"
            >
              Esplora i settori
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </RevealOnScroll>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#018856] to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000} />
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Settori Navigation Tabs */}
      <section id="settori" className="py-20 section-gradient-1 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#018856]/10 text-[#018856] text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Aree di intervento
              </span>
              <h2 className="text-4xl font-bold text-gray-900">I nostri ambiti</h2>
            </div>
          </RevealOnScroll>

          {/* Tab navigation */}
          <RevealOnScroll delay={100}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {settori.map((settore, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSettore(index)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeSettore === index
                      ? "bg-[#018856] text-white shadow-lg shadow-[#018856]/25"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <settore.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{settore.name}</span>
                </button>
              ))}
            </div>
          </RevealOnScroll>

          {/* Active settore content */}
          <RevealOnScroll delay={200}>
            <GlowCard>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-5 gap-0">
                  {/* Image */}
                  <div className="lg:col-span-2 relative h-64 lg:h-auto min-h-[300px]">
                    <Image
                      src={settori[activeSettore].image}
                      alt={settori[activeSettore].name}
                      fill
                      className="object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/50 lg:block hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

                    {/* Title overlay on mobile */}
                    <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                      <div className={`inline-flex w-12 h-12 bg-gradient-to-br ${settori[activeSettore].gradient} rounded-xl items-center justify-center mb-2`}>
                        {(() => {
                          const Icon = settori[activeSettore].icon;
                          return <Icon className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{settori[activeSettore].name}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-3 p-8">
                    {/* Title for desktop */}
                    <div className="hidden lg:flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${settori[activeSettore].gradient} rounded-xl flex items-center justify-center`}>
                        {(() => {
                          const Icon = settori[activeSettore].icon;
                          return <Icon className="w-7 h-7 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{settori[activeSettore].name}</h3>
                        <p className="text-gray-600">{settori[activeSettore].description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Rappresentiamo */}
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-4 flex items-center text-sm uppercase tracking-wider">
                          <Users className="h-4 w-4 text-[#018856] mr-2" />
                          Rappresentiamo
                        </h4>
                        <ul className="space-y-3">
                          {settori[activeSettore].items.map((item, i) => (
                            <li key={i} className="flex items-start text-gray-600 text-sm group">
                              <div className="w-6 h-6 bg-[#018856]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-[#018856]/20 transition-colors">
                                <ChevronRight className="h-3 w-3 text-[#018856]" />
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Focus */}
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-4 flex items-center text-sm uppercase tracking-wider">
                          <Target className="h-4 w-4 text-[#018856] mr-2" />
                          Il nostro focus
                        </h4>
                        <ul className="space-y-3">
                          {settori[activeSettore].focus.map((item, i) => (
                            <li key={i} className="flex items-start text-gray-600 text-sm group">
                              <div className="w-6 h-6 bg-[#018856]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-[#018856]/20 transition-colors">
                                <ChevronRight className="h-3 w-3 text-[#018856]" />
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* All Settori Cards */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Panoramica completa</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Esplora tutti i settori in cui FAILMS opera per garantire i diritti dei lavoratori
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            {settori.map((settore, index) => (
              <RevealOnScroll key={index} delay={index * 100} direction="scale">
                <div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500"
                  onClick={() => {
                    setActiveSettore(index);
                    document.getElementById("settori")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {/* Background image */}
                  <div className="relative h-64">
                    <Image
                      src={settore.image}
                      alt={settore.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className={`inline-flex w-12 h-12 bg-gradient-to-br ${settore.gradient} rounded-xl items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <settore.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{settore.name}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{settore.description}</p>
                    <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300 transition-colors">
                      Scopri di più
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 cta-gradient relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <FloatingElement amplitude={30} speed={1.5} className="absolute -left-20 top-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </FloatingElement>
        <FloatingElement amplitude={25} speed={2} delay={1} className="absolute -right-20 top-1/3">
          <div className="w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl" />
        </FloatingElement>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <RevealOnScroll>
            <div className="w-20 h-20 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              <TextReveal text="Lavori in uno di questi settori?" staggerDelay={40} />
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              FAILMS è al tuo fianco per tutelare i tuoi diritti e costruire insieme
              un futuro migliore nel mondo del lavoro industriale.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#018856] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:shadow-xl group"
              >
                Contattaci ora
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/servizi"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                I nostri servizi
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
