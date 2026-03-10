"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Target,
  Shield,
  Scale,
  Heart,
  Lightbulb,
  Building2,
  ChevronRight,
  Factory,
  Handshake,
  Globe,
  Calendar,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  RevealOnScroll,
  GlowCard,
  AnimatedCounter,
  FloatingElement,
} from "@/components/ui/premium";

const valori = [
  {
    name: "Autonomia",
    description: "Decisioni sindacali libere da condizionamenti politico-partitici.",
    icon: Target,
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Contrattazione",
    description: "Il contratto collettivo come strumento centrale di tutela.",
    icon: Scale,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Legalità",
    description: "Gestione rigorosa, regole chiare, responsabilità diffusa.",
    icon: Shield,
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Inclusione",
    description: "Parità di genere, integrazione, tutela delle diversità.",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Prossimità",
    description: "Presenza nei luoghi di lavoro, ascolto quotidiano.",
    icon: Building2,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Innovazione",
    description: "Modelli di welfare che migliorino la qualità della vita.",
    icon: Lightbulb,
    color: "from-cyan-500 to-sky-600",
  },
];

const stats = [
  { value: 40, suffix: "+", label: "Anni di storia", icon: Calendar },
  { value: 25, suffix: "", label: "Sedi territoriali", icon: Globe },
  { value: 2000, suffix: "+", label: "Iscritti", icon: Users },
  { value: 50, suffix: "+", label: "Accordi", icon: Handshake },
];

const timeline = [
  { year: "1987", event: "Inizio in Alfa Romeo Avio" },
  { year: "1991", event: "Prima elezione RSU" },
  { year: "1998", event: "Primo eletto FAILMS in Fiat Avio" },
  { year: "2007", event: "Segretario Provinciale Napoli" },
  { year: "2014", event: "Vice Segretario Nazionale" },
  { year: "2024", event: "Segretario Generale FAILMS" },
];

export default function ChiSiamoContent() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero - Full width with logo */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/eventi/dirigenti-failms-conferenza.jpg"
            alt="Dirigenti FAILMS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-emerald-300 text-sm font-medium mb-6">
                  <Award className="w-4 h-4" />
                  Chi siamo
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Il sindacato dei{" "}
                  <span className="text-[#018856]">lavoratori metalmeccanici</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                  Il sindacato dell&apos;industria metalmeccanica e siderurgica che costruisce futuro nei luoghi di lavoro.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contatti">
                    <button className="px-6 py-3 bg-[#018856] text-white rounded-xl font-medium hover:bg-[#016d45] transition-all flex items-center gap-2 group">
                      Aderisci ora
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/servizi">
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20">
                      I nostri servizi
                    </button>
                  </Link>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right - Logo Card */}
            <RevealOnScroll delay={200} direction="right">
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <Image
                      src="/images/logo-failms-new.png"
                      alt="FAILMS CONFIAL Logo"
                      width={500}
                      height={160}
                      className="w-full h-auto"
                    />
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-gray-600 text-center text-sm">
                        Federazione Autonoma Italiana<br />
                        Lavoratori Metalmeccanici e Siderurgici
                      </p>
                    </div>
                  </div>
                  {/* Decorative */}
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#018856]/20 rounded-3xl -z-10" />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#018856] to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-7 h-7 text-white" />
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

      {/* Mission & CONFIAL */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left - Mission */}
            <RevealOnScroll>
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#018856]/10 text-[#018856] text-sm font-medium mb-4">
                  <Factory className="w-4 h-4" />
                  La nostra missione
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Tutelare i diritti, costruire futuro
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Siamo un sindacato che mette al centro la <strong className="text-gray-900">persona</strong>,
                    la dignità del lavoro e la qualità dello sviluppo industriale.
                  </p>
                  <p>
                    I nostri pilastri: <strong className="text-gray-900">tutela dei diritti</strong>,
                    contrattazione inclusiva, sicurezza sul lavoro, formazione continua
                    e partecipazione dei lavoratori.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: Shield, label: "Tutela diritti" },
                    { icon: Scale, label: "Contrattazione" },
                    { icon: Heart, label: "Sicurezza" },
                    { icon: Lightbulb, label: "Formazione" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                      <div className="w-10 h-10 bg-[#018856]/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-[#018856]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Right - CONFIAL */}
            <RevealOnScroll delay={200}>
              <GlowCard>
                <div className="p-8 bg-gradient-to-br from-[#018856] to-emerald-700 rounded-2xl text-white h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Polo Industria</h3>
                      <p className="text-emerald-200 text-sm">FAILMS + CONFIAL</p>
                    </div>
                  </div>

                  <p className="text-white/90 mb-6 leading-relaxed">
                    FAILMS aderisce a <strong>CONFIAL</strong> - Confederazione Italiana Autonoma Lavoratori,
                    una confederazione libera e indipendente presente su tutto il territorio nazionale.
                  </p>

                  <p className="text-white/80 mb-6">
                    L&apos;obiettivo: costruire un <strong className="text-white">sindacato industriale forte</strong>,
                    capace di negoziare nuovi modelli contrattuali e governare la transizione digitale ed ecologica.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["Metalmeccanica", "Siderurgia", "Industria"].map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#018856]/10 text-[#018856] text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                I nostri valori
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Cosa ci guida</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                La nostra visione: un&apos;industria che innovi senza lasciare indietro nessuno.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valori.map((valore, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all group h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${valore.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <valore.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{valore.name}</h3>
                  <p className="text-gray-600">{valore.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <RevealOnScroll>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/eventi/congresso-dirigente-sciarpa.jpg"
                    alt="Vincenzo Russo"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white">Vincenzo Russo</h3>
                    <p className="text-[#018856]">Segretario Generale FAILMS</p>
                  </div>
                </div>
                <FloatingElement amplitude={10} speed={2} className="absolute -bottom-4 -right-4">
                  <div className="bg-[#018856] text-white px-6 py-3 rounded-xl shadow-xl">
                    <div className="text-2xl font-bold">35+</div>
                    <div className="text-sm text-emerald-200">Anni di esperienza</div>
                  </div>
                </FloatingElement>
              </div>
            </RevealOnScroll>

            {/* Timeline */}
            <RevealOnScroll delay={200}>
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-sm font-medium mb-4">
                  <TrendingUp className="w-4 h-4" />
                  Il percorso
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  Una vita dedicata ai lavoratori
                </h2>

                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="w-16 text-right">
                        <span className="text-[#018856] font-bold">{item.year}</span>
                      </div>
                      <div className="w-3 h-3 bg-[#018856] rounded-full group-hover:scale-150 transition-transform" />
                      <div className="flex-1 p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                        <span className="text-white/80">{item.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">I nostri eventi</h2>
              <p className="text-gray-600">Congressi, assemblee e momenti di partecipazione</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "/images/eventi/congresso-assemblea-generale.jpg",
              "/images/eventi/congresso-relatore-podio.jpg",
              "/images/eventi/congresso-tavolo-presidenza.jpg",
              "/images/eventi/congresso-pubblico-sala.jpg",
              "/images/eventi/congresso-relatore-bandiere.jpg",
              "/images/eventi/congresso-lanyards-failms.jpg",
            ].map((src, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                  <Image
                    src={src}
                    alt={`Evento FAILMS ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#018856] to-emerald-700 relative overflow-hidden">
        <FloatingElement amplitude={30} speed={1.5} className="absolute -left-20 top-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </FloatingElement>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Unisciti a noi
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <p className="text-xl text-white/90 mb-10">
              FAILMS è sempre al tuo fianco per tutelare i tuoi diritti.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contatti">
                <button className="px-8 py-4 bg-white text-[#018856] rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 group shadow-xl">
                  Contattaci ora
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/servizi">
                <button className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/30">
                  I nostri servizi
                </button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
