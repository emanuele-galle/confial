"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Factory,
  FileText,
  Shield,
  Tv,
  Building2,
  Wrench,
  Calculator,
  Home,
  ShoppingCart,
  Gavel,
  BookOpen,
  ChevronRight,
  Calendar,
  MapPin,
  ArrowRight,
  Phone,
  Mail,
  ExternalLink,
  Users,
  Award,
  Sparkles,
  Play,
  Target,
  TrendingUp,
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimatedCounter,
  RevealOnScroll,
  GlowCard,
  MagneticButton,
  FloatingElement,
  TextReveal,
} from "@/components/ui/premium";

const heroSlides = [
  {
    image: "/images/hero-copertina.jpg",
    title: "Difendiamo i",
    highlight: "tuoi diritti",
    subtitle: "sul lavoro",
    description: "FAILMS CONFIAL: il sindacato dell'industria metalmeccanica e siderurgica che costruisce futuro nei luoghi di lavoro.",
    badge: "Sindacato Autonomo dal 1984",
    floatingTitle: "Tutela garantita",
    floatingSubtitle: "Per tutti i lavoratori",
    floatingIcon: Shield,
  },
  {
    image: "/images/settori/operaio-saldatore.jpg",
    title: "Al fianco dei",
    highlight: "lavoratori",
    subtitle: "ogni giorno",
    description: "Presenza costante nei luoghi di lavoro, ascolto quotidiano e tutela effettiva dei diritti.",
    badge: "Sempre presenti",
    floatingTitle: "Prossimità",
    floatingSubtitle: "Ascolto quotidiano",
    floatingIcon: Users,
  },
  {
    image: "/images/settori/acciaieria-produzione.jpg",
    title: "Presenti nella",
    highlight: "grande industria",
    subtitle: "italiana",
    description: "Dai grandi gruppi siderurgici alle fonderie: rappresentiamo i lavoratori in tutta la filiera industriale.",
    badge: "2000+ Lavoratori iscritti",
    floatingTitle: "Contrattazione forte",
    floatingSubtitle: "Accordi nazionali",
    floatingIcon: FileText,
  },
  {
    image: "/images/settori/lavorazione-metallo-scintille.jpg",
    title: "Formazione e",
    highlight: "crescita",
    subtitle: "professionale",
    description: "Investiamo nella formazione dei lavoratori e dei delegati per una rappresentanza sempre più qualificata.",
    badge: "50+ Accordi firmati",
    floatingTitle: "Competenza",
    floatingSubtitle: "Formazione continua",
    floatingIcon: BookOpen,
  },
  {
    image: "/images/settori/fabbrica-robot.jpg",
    title: "Innovazione e",
    highlight: "transizione",
    subtitle: "digitale",
    description: "Accompagniamo le aziende e i lavoratori nella transizione tecnologica, tutelando occupazione e competenze.",
    badge: "Futuro del lavoro",
    floatingTitle: "Innovazione",
    floatingSubtitle: "Industria 4.0",
    floatingIcon: TrendingUp,
  },
];

const services = [
  { name: "Servizi fiscali (CAF)", href: "/servizi/caf", icon: Calculator, desc: "Dichiarazioni, ISEE, bonus", color: "from-blue-500 to-blue-600" },
  { name: "Patronato", href: "/servizi/patronato", icon: Shield, desc: "Pensioni, infortuni, malattia", color: "from-emerald-500 to-emerald-600" },
  { name: "Sportello inquilinato", href: "/servizi/inquilinato", icon: Home, desc: "Contratti, assistenza casa", color: "from-amber-500 to-amber-600" },
  { name: "Associazione consumatori", href: "/servizi/consumatori", icon: ShoppingCart, desc: "Tutela acquisti, reclami", color: "from-purple-500 to-purple-600" },
  { name: "Consulenza legale", href: "/servizi/legale", icon: Gavel, desc: "Diritto del lavoro", color: "from-rose-500 to-rose-600" },
  { name: "Vertenze di lavoro", href: "/servizi/vertenze", icon: FileText, desc: "Recupero crediti, cause", color: "from-cyan-500 to-cyan-600" },
  { name: "Istituto studi", href: "/servizi/istituto-studi", icon: BookOpen, desc: "Formazione e ricerca", color: "from-indigo-500 to-indigo-600" },
];

const sectors = [
  {
    name: "Grande industria",
    description: "Grandi gruppi metalmeccanici e siderurgici nazionali",
    icon: Building2,
    image: "/images/settori/acciaieria-produzione.jpg",
  },
  {
    name: "Media impresa",
    description: "Aziende metalmeccaniche strutturate del territorio",
    icon: Factory,
    image: "/images/settori/lavorazione-metallo-scintille.jpg",
  },
  {
    name: "Piccole imprese",
    description: "Officine, terzisti, subfornitori e indotto",
    icon: Wrench,
    image: "/images/eventi/congresso-assemblea-generale.jpg",
  },
];

const values = [
  { name: "Autonomia", description: "Decisioni sindacali libere da condizionamenti politico-partitici", icon: Target },
  { name: "Contrattazione", description: "Il contratto collettivo come strumento centrale di tutela", icon: FileText },
  { name: "Legalità", description: "Gestione rigorosa, regole chiare, responsabilità diffusa", icon: Shield },
  { name: "Inclusione", description: "Parità di genere, integrazione, tutela delle diversità", icon: Users },
  { name: "Prossimità", description: "Presenza fisica nei luoghi di lavoro, ascolto quotidiano", icon: MapPin },
  { name: "Innovazione", description: "Modelli di welfare che migliorino la qualità della vita", icon: TrendingUp },
];

const stats = [
  { value: 40, suffix: "+", label: "Anni di esperienza" },
  { value: 2000, suffix: "+", label: "Lavoratori iscritti" },
  { value: 50, suffix: "+", label: "Accordi firmati" },
  { value: 25, suffix: "+", label: "Sedi territoriali" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  const slide = heroSlides[currentSlide];
  const SlideIcon = slide.floatingIcon;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Full Screen Slider */}
      <section className="relative h-[85vh] sm:h-[90vh] lg:h-screen overflow-hidden">
        {/* Background Images - All slides */}
        {heroSlides.map((s, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={s.image}
              alt={`${s.highlight} - FAILMS CONFIAL`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Overlay - light vignette to see image, stronger on mobile for card contrast */}
        <div className="absolute inset-0 bg-black/40 lg:bg-transparent" />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-black via-black/50 via-40% to-transparent" />

        {/* Content - centered card on mobile, left-aligned on desktop */}
        <div className="relative z-10 h-full flex items-center justify-center lg:justify-start">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile: centered card / Desktop: left-aligned content */}
            <div className="lg:max-w-xl">
              {/* Card container - visible on mobile, transparent on desktop */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 lg:bg-transparent lg:backdrop-blur-none lg:border-0 lg:p-0">
                {/* Badge */}
                <div key={`badge-${currentSlide}`} className="animate-fadeInUp text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#018856] rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">{slide.badge}</span>
                  </div>
                </div>

                {/* Main heading */}
                <div key={`title-${currentSlide}`} className="animate-fadeInUp text-center lg:text-left" style={{ animationDelay: '100ms' }}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-3 sm:mb-4 leading-[1.1]">
                    {slide.title}{" "}
                    <span className="text-[#00c46a]">
                      {slide.highlight}
                    </span>{" "}
                    {slide.subtitle}
                  </h1>
                </div>

                {/* Description */}
                <div key={`desc-${currentSlide}`} className="animate-fadeInUp text-center lg:text-left" style={{ animationDelay: '200ms' }}>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-5 sm:mb-6 leading-relaxed">
                    {slide.description}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Link href="/contatti" aria-label="Aderisci a FAILMS CONFIAL">
                      <Button size="lg" className="w-full sm:w-auto bg-[#018856] hover:bg-[#00a366] text-white px-6 py-3 text-sm sm:text-base font-bold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
                        Aderisci ora
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/chi-siamo" aria-label="Scopri chi siamo">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300">
                        Scopri di più
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Info badge */}
                <div className="flex items-center gap-3 mt-5 sm:mt-6 pt-5 border-t border-white/20 lg:border-0 lg:pt-0 lg:mt-8 justify-center lg:justify-start animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 lg:bg-gradient-to-br lg:from-[#00c46a] lg:to-[#018856] lg:border-0">
                    <SlideIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{slide.floatingTitle}</div>
                    <div className="text-xs text-white/70">{slide.floatingSubtitle}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 z-20 shadow-lg"
          aria-label="Slide precedente"
        >
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 z-20 shadow-lg"
          aria-label="Slide successiva"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 sm:w-10 bg-white shadow-lg'
                  : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Vai alla slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        {isAutoPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
            <div
              key={currentSlide}
              className="h-full bg-[#018856] animate-slideProgress"
            />
          </div>
        )}
      </section>

      {/* Event Banner - Premium */}
      <section className="relative cta-gradient py-4 sm:py-8 overflow-hidden">
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/15 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Calendar className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-sm sm:text-base md:text-xl line-clamp-2">Conferenza Nazionale di Organizzazione</h3>
                <p className="text-white/80 flex items-center gap-2 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  <MapPin className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                  <span className="line-clamp-1">18 Dic 2025 - Hotel Gold Tower, Napoli</span>
                </p>
              </div>
            </div>
            <MagneticButton>
              <Link href="/news" aria-label="Scopri l'evento Conferenza Nazionale" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-[#018856] hover:bg-gray-100 font-bold px-6 sm:px-8 py-3 sm:py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  Scopri l&apos;evento
                  <ChevronRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <GlowCard className="premium-card rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-1 sm:mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-500 font-medium text-xs sm:text-base">{stat.label}</div>
                </GlowCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - Bento Grid */}
      <section className="py-12 sm:py-24 section-gradient-1 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealOnScroll>
            <div className="text-center mb-8 sm:mb-16">
              <span className="inline-flex items-center gap-2 text-[#018856] font-semibold text-xs sm:text-sm uppercase tracking-wider bg-emerald-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-4 sm:mb-6">
                <Sparkles className="h-3 sm:h-4 w-3 sm:w-4" />
                I nostri valori
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 px-2">
                Il Polo Industria CONFIAL
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg px-4">
                FAILMS è la federazione autonoma che rappresenta le lavoratrici e i lavoratori
                dell&apos;industria metalmeccanica, siderurgica e dei servizi collegati.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {values.map((value, index) => (
              <RevealOnScroll key={index} delay={index * 80}>
                <GlowCard className="group premium-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 h-full">
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#018856] group-hover:to-emerald-600 transition-all duration-500">
                      <value.icon className="h-5 sm:h-7 w-5 sm:w-7 text-[#018856] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base sm:text-xl mb-1 sm:mb-3">{value.name}</h3>
                      <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{value.description}</p>
                    </div>
                  </div>
                </GlowCard>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={600}>
            <div className="text-center mt-8 sm:mt-12">
              <MagneticButton>
                <Link href="/chi-siamo" aria-label="Scopri la storia di FAILMS CONFIAL">
                  <Button variant="outline" className="border-2 border-[#018856] text-[#018856] hover:bg-[#018856] hover:text-white px-5 sm:px-8 py-2.5 sm:py-3 text-sm rounded-xl transition-all duration-300">
                    Scopri la nostra storia
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Sectors Section - Cards with images */}
      <section className="py-12 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-8 sm:mb-16">
              <span className="inline-flex items-center gap-2 text-[#018856] font-semibold text-xs sm:text-sm uppercase tracking-wider bg-emerald-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-4 sm:mb-6">
                <Factory className="h-3 sm:h-4 w-3 sm:w-4" />
                I nostri settori
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 px-2">
                Settori che rappresentiamo
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg px-4">
                FAILMS è presente nei più importanti gruppi industriali italiani e nelle filiere
                territoriali dell&apos;industria metalmeccanica e siderurgica.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {sectors.map((sector, index) => (
              <RevealOnScroll key={index} delay={index * 150} direction="scale">
                <Link href="/settori" aria-label={`Scopri il settore ${sector.name}`} className="block h-full group">
                  <div className="relative h-[280px] sm:h-[350px] md:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Background image */}
                    <Image
                      src={sector.image}
                      alt={sector.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                    {/* Overlay - Enhanced contrast for accessibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                      <div className="w-10 sm:w-14 h-10 sm:h-14 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#018856] transition-colors duration-300">
                        <sector.icon className="h-5 sm:h-7 w-5 sm:w-7 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                        {sector.name}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {sector.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={500}>
            <div className="text-center mt-8 sm:mt-12">
              <MagneticButton>
                <Link href="/settori" aria-label="Visualizza tutti i settori industriali">
                  <Button variant="outline" className="border-2 border-gray-200 hover:border-[#018856] hover:text-[#018856] px-5 sm:px-8 py-2.5 sm:py-3 text-sm rounded-xl transition-all duration-300">
                    Tutti i settori
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Services Section - Modern cards */}
      <section className="py-12 sm:py-24 section-gradient-2 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-emerald-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealOnScroll>
            <div className="text-center mb-8 sm:mb-16">
              <span className="inline-flex items-center gap-2 text-[#018856] font-semibold text-xs sm:text-sm uppercase tracking-wider bg-emerald-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-4 sm:mb-6">
                <Shield className="h-3 sm:h-4 w-3 sm:w-4" />
                I nostri servizi
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 px-2">
                Una piattaforma integrata
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg px-4">
                FAILMS non è solo contrattazione: è anche una piattaforma integrata di servizi per
                le lavoratrici, i lavoratori e le loro famiglie.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {services.map((service, index) => (
              <RevealOnScroll key={index} delay={index * 60}>
                <Link href={service.href} aria-label={`Servizio ${service.name}`} className="block h-full group">
                  <GlowCard className="premium-card rounded-xl sm:rounded-2xl p-3 sm:p-6 h-full">
                    <div className={`w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br ${service.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-5 sm:h-7 w-5 sm:w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#018856] transition-colors text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 hidden xs:block">{service.desc}</p>
                  </GlowCard>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={500}>
            <div className="text-center mt-8 sm:mt-12">
              <MagneticButton>
                <Link href="/servizi" aria-label="Visualizza tutti i servizi FAILMS">
                  <Button className="bg-[#018856] hover:bg-[#016b43] text-white px-5 sm:px-8 py-2.5 sm:py-3 text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Tutti i servizi
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Mission Section - Enhanced */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#018856]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative quote marks */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 text-[80px] sm:text-[120px] text-[#018856]/10 font-serif leading-none select-none">&ldquo;</div>
            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 text-[80px] sm:text-[120px] text-[#018856]/10 font-serif leading-none rotate-180 select-none">&ldquo;</div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <RevealOnScroll>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#018856]/10 rounded-full text-[#018856] text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
                  <Target className="h-4 w-4" />
                  La nostra missione
                </span>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-snug mb-8 sm:mb-12">
                  Dare <span className="text-[#018856]">voce</span> e <span className="text-[#018856]">valore</span> al lavoro,
                  costruendo un sindacato industriale forte, autorevole e moderno.
                </blockquote>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src="/images/logo-failms-new.png"
                          alt="CONFIAL Logo"
                          fill
                          className="object-contain p-2 bg-white"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-lg sm:text-xl">CONFIAL</div>
                      <div className="text-gray-500 text-sm">Confederazione Italiana<br className="sm:hidden" /> Autonoma Lavoratori</div>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-gray-200" />
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#018856] rounded-full" />
                      <span>Autonomia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#018856] rounded-full" />
                      <span>Indipendenza</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#018856] rounded-full" />
                      <span>Trasparenza</span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* WebTV Section - Premium */}
      <section className="py-12 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <RevealOnScroll direction="left">
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 text-[#018856] font-semibold text-xs sm:text-sm uppercase tracking-wider bg-emerald-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-4 sm:mb-6">
                  <Tv className="h-3 sm:h-4 w-3 sm:w-4" />
                  FAILMS WebTV
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                  Polo Industria WebTV
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-lg leading-relaxed">
                  In sinergia con CONFIAL Italia TV, sviluppiamo uno spazio dedicato
                  all&apos;industria e al lavoro metalmeccanico e siderurgico.
                </p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-10 text-left">
                  {[
                    "Approfondimenti su contrattazione e accordi",
                    "Reportage dagli stabilimenti",
                    "Interviste a delegati e esperti",
                    "Rubriche su sicurezza e innovazione",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 sm:gap-4 text-gray-700">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-[#018856]" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col xs:flex-row justify-center lg:justify-start gap-3">
                  <MagneticButton>
                    <a href="https://confialtv.it" target="_blank" rel="noopener noreferrer" aria-label="Vai al sito CONFIAL Italia TV" className="w-full xs:w-auto">
                      <Button className="w-full xs:w-auto bg-[#018856] hover:bg-[#016b43] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg text-sm">
                        <Tv className="mr-2 h-4 w-4" />
                        Vai a CONFIAL TV
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </a>
                  </MagneticButton>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="right" delay={200}>
              <div className="relative mt-8 lg:mt-0">
                <div className="aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative">
                  {/* Vimeo Video Embed */}
                  <iframe
                    src="https://player.vimeo.com/video/1080282532?h=&badge=0&autopause=0&player_id=0&app_id=58479&background=1&loop=1&autoplay=1&muted=1"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    className="absolute inset-0 w-full h-full"
                    title="CONFIAL Italia TV"
                  />
                  {/* Overlay with link to CONFIAL TV */}
                  <a
                    href="https://confialtv.it"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Guarda il video e vai a CONFIAL Italia TV"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-center pb-4 sm:pb-8 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="text-center">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 backdrop-blur-sm border border-white/20">
                        <Play className="h-6 sm:h-8 w-6 sm:w-8 text-white ml-0.5" fill="white" />
                      </div>
                      <h3 className="text-base sm:text-xl font-bold text-white drop-shadow-lg">Vai a CONFIAL Italia TV</h3>
                    </div>
                  </a>
                </div>

                {/* Decorative elements - hidden on mobile */}
                <FloatingElement className="absolute -bottom-6 sm:-bottom-8 -right-6 sm:-right-8 w-24 sm:w-40 h-24 sm:h-40 -z-10 hidden sm:block" amplitude={12} speed={2}>
                  <div className="w-full h-full bg-emerald-100 rounded-2xl sm:rounded-3xl" />
                </FloatingElement>
                <FloatingElement className="absolute -top-6 sm:-top-8 -left-6 sm:-left-8 w-16 sm:w-24 h-16 sm:h-24 -z-10 hidden sm:block" amplitude={8} speed={2.5} delay={1}>
                  <div className="w-full h-full bg-emerald-50 rounded-xl sm:rounded-2xl" />
                </FloatingElement>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-16 sm:py-24 bg-gray-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23018856%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#018856]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#018856] via-emerald-600 to-[#016b43] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            {/* Decorative shapes inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 text-center">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-white text-xs sm:text-sm font-semibold mb-6 backdrop-blur-sm border border-white/20">
                  <Users className="h-4 w-4" />
                  Entra nella nostra famiglia
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
                  Pronto a unirti a noi?
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <p className="text-white/80 text-sm sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Costruiamo insieme un sindacato industriale forte e moderno.
                  Tutela, formazione e rappresentanza per ogni lavoratore.
                </p>
              </RevealOnScroll>

              {/* Benefits grid */}
              <RevealOnScroll delay={250}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
                  {[
                    { icon: Shield, label: "Tutela" },
                    { icon: FileText, label: "Assistenza" },
                    { icon: Users, label: "Comunità" },
                    { icon: Award, label: "Esperienza" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <item.icon className="h-6 w-6 text-white" />
                      <span className="text-white/90 text-xs sm:text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton>
                    <Link href="/contatti" aria-label="Scopri come aderire a FAILMS CONFIAL">
                      <Button className="w-full sm:w-auto bg-white text-[#018856] hover:bg-gray-100 font-bold px-8 py-4 text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <Mail className="mr-2 h-5 w-5" />
                        Richiedi informazioni
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <a href="tel:+390812345678" aria-label="Chiama FAILMS CONFIAL">
                      <Button variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 text-base rounded-xl transition-all duration-300">
                        <Phone className="mr-2 h-5 w-5" />
                        Chiamaci ora
                      </Button>
                    </a>
                  </MagneticButton>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
