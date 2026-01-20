"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  BookOpen,
  ChevronRight,
  Camera,
  Clock,
  Sparkles,
  ArrowRight,
  Megaphone,
} from "lucide-react";
import {
  RevealOnScroll,
  GlowCard,
  FloatingElement,
  TextReveal,
} from "@/components/ui/premium";

const eventGallery = [
  { src: "/images/eventi/congresso-relatore-podio.jpg", alt: "Relatore al podio" },
  { src: "/images/eventi/congresso-assemblea-generale.jpg", alt: "Assemblea generale" },
  { src: "/images/assemblee/assemblea-votazione.jpg", alt: "Votazione" },
  { src: "/images/eventi/congresso-tavolo-presidenza.jpg", alt: "Tavolo presidenza" },
  { src: "/images/assemblee/assemblea-lavoratori-sala.jpg", alt: "Assemblea lavoratori" },
  { src: "/images/eventi/congresso-relatore-anziano.jpg", alt: "Intervento" },
];

const programItems = [
  {
    time: "09:30",
    title: "Relazione introduttiva",
    speaker: "Vincenzo Russo",
    role: "Segretario Generale FAILMS Nazionale",
  },
  {
    time: "10:30",
    title: "Presidenza dei lavori",
    speaker: "Maurizio Ballistreri",
    role: "Presidente ISL – Istituto Studi sul Lavoro",
  },
  {
    time: "12:30",
    title: "Conclusioni",
    speaker: "Benedetto Di Iacovo",
    role: "Segretario Generale CONFIAL Nazionale",
  },
];

const poloIndustriaPoints = [
  "Le politiche industriali e di sviluppo territoriale",
  "Le transizioni digitale ed energetica nelle imprese",
  "La contrattazione di secondo livello e i sistemi di welfare aziendale",
  "I percorsi di partecipazione dei lavoratori all'organizzazione e ai risultati d'impresa",
];

export default function NewsPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement amplitude={15} speed={2} delay={0}>
            <div className="absolute top-20 left-[10%] w-64 h-64 bg-gradient-to-br from-[#018856]/20 to-emerald-500/10 rounded-full blur-3xl" />
          </FloatingElement>
          <FloatingElement amplitude={20} speed={1.5} delay={1}>
            <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-br from-blue-500/15 to-indigo-500/10 rounded-full blur-3xl" />
          </FloatingElement>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-gray-700 mb-6">
              <Megaphone className="w-4 h-4 text-[#018856]" />
              News e Comunicati
            </span>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient">Ultime</span>{" "}
              <span className="text-gray-800">Notizie</span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              Eventi, comunicati e aggiornamenti dal mondo FAILMS-CONFIAL
            </p>
          </RevealOnScroll>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Evento in evidenza
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <GlowCard glowColor="rgba(1, 136, 86, 0.3)">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#018856] to-emerald-600 text-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-sm">Data evento</p>
                        <p className="font-bold text-lg">18 Dicembre 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-sm">Location</p>
                        <p className="font-bold text-lg">Hotel Gold Tower, Napoli</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-sm">Inizio lavori</p>
                        <p className="font-bold text-lg">ore 9.30</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 lg:h-full min-h-[300px]">
                    <Image
                      src="/images/locandine/locandina-conferenza-nazionale-2025.jpg"
                      alt="Conferenza Nazionale FAILMS-CONFIAL 2025"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 lg:hidden" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Conferenza Nazionale di Organizzazione
                    </h2>
                    <p className="text-[#018856] font-semibold text-lg mb-6">
                      FAILMS-CONFIAL: nasce il Polo Industria
                    </p>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Momento strategico in cui sarà formalizzata l&apos;adesione della FAILMS
                      alla CONFIAL e la contestuale nascita del nuovo <strong className="text-gray-900">Polo Industria</strong>.
                    </p>

                    {/* Programma */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#018856]" />
                        Programma
                      </h3>
                      <div className="space-y-3">
                        {programItems.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-xs font-bold bg-[#018856] text-white px-2 py-1 rounded">
                              {item.time}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                              <p className="text-gray-600 text-xs">{item.speaker} - {item.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/contatti"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#018856] text-white rounded-xl font-medium hover:bg-[#016d45] transition-all duration-300 hover:shadow-lg hover:shadow-[#018856]/25 group"
                    >
                      Partecipa all&apos;evento
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* Quote dichiarazioni */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/settori/siderurgia.jpg')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-emerald-900/50" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
                Dichiarazioni
              </span>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-8">
            <RevealOnScroll delay={100}>
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-6xl text-[#018856] opacity-50">&quot;</div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-white/90 italic leading-relaxed mb-4">
                    La Conferenza di Napoli segna un passaggio di crescita per la nostra Confederazione
                    e per tutto il sindacalismo autonomo. Con l&apos;adesione di FAILMS, la CONFIAL consolida
                    un Polo Industria in grado di essere interlocutore strutturato nei principali settori
                    produttivi del Paese.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#018856] rounded-full flex items-center justify-center text-white font-bold">
                      BD
                    </div>
                    <div>
                      <p className="text-white font-semibold">Benedetto Di Iacovo</p>
                      <p className="text-emerald-400 text-sm">Segretario Generale CONFIAL</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-6xl text-[#018856] opacity-50">&quot;</div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-white/90 italic leading-relaxed mb-4">
                    La scelta di federarci con CONFIAL nasce da una valutazione strategica: per presidiare
                    davvero le trasformazioni dell&apos;industria servono massa critica, visione e un progetto
                    confederale moderno. Da Napoli parte un percorso che vuole fare del sindacato un player
                    di sistema nelle scelte industriali del Paese.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#018856] rounded-full flex items-center justify-center text-white font-bold">
                      VR
                    </div>
                    <div>
                      <p className="text-white font-semibold">Vincenzo Russo</p>
                      <p className="text-emerald-400 text-sm">Segretario Generale FAILMS</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Book Presentation */}
      <section className="py-20 section-gradient-1 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <GlowCard>
              <div className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-40 bg-gradient-to-br from-[#018856] to-emerald-600 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#018856]/10 text-[#018856] text-sm font-medium mb-3">
                      <BookOpen className="w-4 h-4" />
                      Presentazione libro
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Umanesimo del lavoro
                    </h3>
                    <p className="text-[#018856] font-medium mb-4">
                      Il sindacato e l&apos;intelligenza artificiale
                    </p>
                    <p className="text-gray-600">
                      Nel corso dell&apos;iniziativa verrà presentato il volume dedicato al rapporto tra innovazione
                      tecnologica, intelligenza artificiale e tutele della persona che lavora.
                      Saranno presenti gli autori.
                    </p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* Polo Industria */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#018856]/10 text-[#018856] text-sm font-medium mb-4">
                Il progetto
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Il nuovo Polo Industria
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
              <p className="text-gray-600 text-lg mb-8 text-center max-w-3xl mx-auto">
                L&apos;adesione di FAILMS a CONFIAL risponde all&apos;esigenza di aggregare competenze
                e rappresentanza in un unico hub sindacale dell&apos;industria, capace di presidiare
                con maggiore efficacia:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {poloIndustriaPoints.map((point, index) => (
                  <RevealOnScroll key={index} delay={150 + index * 50} direction="scale">
                    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow group">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#018856] to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <ChevronRight className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-gray-700">{point}</p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>

              <p className="text-center text-gray-600">
                Il <strong className="text-[#018856]">Polo Industria</strong> nasce con la mission di coniugare
                competitività delle aziende, qualità del lavoro e sostenibilità sociale.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 section-gradient-2 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#018856]/10 text-[#018856] text-sm font-medium mb-4">
                <Camera className="w-4 h-4" />
                Eventi passati
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                1° Congresso Regionale FAILMS Campania
              </h2>
              <p className="text-gray-600 text-lg">Gennaio 2024 - Somma Vesuviana</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {eventGallery.map((image, index) => (
              <RevealOnScroll key={index} delay={index * 100} direction="scale">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-sm font-medium">{image.alt}</p>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              <TextReveal text="Vuoi partecipare alla Conferenza?" staggerDelay={40} />
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Contattaci per informazioni sulla partecipazione all&apos;evento del 18 dicembre 2025
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#018856] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:shadow-xl group"
            >
              Contattaci ora
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
