import Link from "next/link";
import Image from "next/image";
import {
  Calculator,
  Shield,
  Home,
  ShoppingCart,
  Gavel,
  FileText,
  BookOpen,
  ArrowRight,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const servizi = [
  {
    name: "Servizi fiscali (CAF)",
    href: "/servizi/caf",
    icon: Calculator,
    description: "Assistenza fiscale completa per iscritti e cittadinanza",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    highlights: [
      "Modello 730 e dichiarazioni dei redditi",
      "Calcolo ISEE",
      "IMU, TASI e tributi locali",
      "Rateizzazioni e cartelle esattoriali",
    ],
  },
  {
    name: "Patronato",
    href: "/servizi/patronato",
    icon: Shield,
    description: "Assistenza previdenziale e socio-assistenziale",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    highlights: [
      "Pensioni di vecchiaia e anticipata",
      "Naspi e disoccupazione",
      "Invalidità civile",
      "Prestazioni INAIL",
    ],
  },
  {
    name: "Sportello inquilinato",
    href: "/servizi/inquilinato",
    icon: Home,
    description: "Consulenza sui rapporti casa-lavoratore",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
    highlights: [
      "Contratti di locazione",
      "Assistenza in caso di sfratto",
      "Alloggi sociali",
      "Mediazione con proprietari",
    ],
  },
  {
    name: "Associazione consumatori",
    href: "/servizi/consumatori",
    icon: ShoppingCart,
    description: "Tutela dei diritti dei consumatori",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    highlights: [
      "Pratiche commerciali scorrette",
      "Contestazioni bollette",
      "Conciliazioni paritetiche",
      "Educazione finanziaria",
    ],
  },
  {
    name: "Consulenza legale",
    href: "/servizi/legale",
    icon: Gavel,
    description: "Assistenza legale in materia di lavoro",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-500/10",
    highlights: [
      "Licenziamenti",
      "Mobbing e discriminazioni",
      "Infortuni sul lavoro",
      "Mancato pagamento retribuzioni",
    ],
  },
  {
    name: "Conteggi e vertenze",
    href: "/servizi/vertenze",
    icon: FileText,
    description: "Ufficio vertenze specializzato",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-500/10",
    highlights: [
      "Conteggi retributivi",
      "Calcolo TFR",
      "Conciliazioni sindacali",
      "Gestione vertenze",
    ],
  },
  {
    name: "Istituto studi",
    href: "/servizi/istituto-studi",
    icon: BookOpen,
    description: "Analisi della giurisprudenza del lavoro",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-500/10",
    highlights: [
      "Monitoraggio pronunce",
      "Analisi sentenze",
      "Linee guida vertenziali",
      "Studi su transizione digitale",
    ],
  },
];

const vantaggi = [
  {
    icon: Clock,
    title: "Assistenza rapida",
    description: "Risposte veloci alle tue esigenze con appuntamenti in tempi brevi",
  },
  {
    icon: Shield,
    title: "Professionisti esperti",
    description: "Team di consulenti qualificati con anni di esperienza nel settore",
  },
  {
    icon: MapPin,
    title: "Capillarità territoriale",
    description: "Sedi distribuite sul territorio per essere sempre vicini a te",
  },
];

export default function ServiziPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/settori/automotive.jpg"
            alt="Servizi FAILMS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[60vh] flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#018856] rounded-full" />
                <span className="text-white/90 text-sm font-medium">Servizi per te e la tua famiglia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Una piattaforma<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018856] to-emerald-400">
                  integrata di servizi
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed">
                FAILMS non è solo contrattazione: è anche assistenza fiscale, previdenziale,
                legale e molto altro per lavoratrici, lavoratori e le loro famiglie.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/contatti">
                  <Button size="lg" className="bg-[#018856] hover:bg-[#016b43] text-white px-8 py-6 text-base font-bold rounded-xl shadow-lg group">
                    Prenota appuntamento
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#servizi">
                  <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl">
                    Esplora i servizi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid md:grid-cols-3 gap-8">
            {vantaggi.map((vantaggio, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#018856]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <vantaggio.icon className="h-6 w-6 text-[#018856]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{vantaggio.title}</h3>
                  <p className="text-gray-600 text-sm">{vantaggio.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servizi" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              I nostri servizi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scopri tutti i servizi che mettiamo a disposizione per tutelare i tuoi diritti
              e semplificare la tua vita quotidiana.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servizi.map((servizio, index) => (
              <Link key={index} href={servizio.href} className="group">
                <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#018856]/20 transition-all duration-300 hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${servizio.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <servizio.icon className={`h-7 w-7 bg-gradient-to-r ${servizio.color} bg-clip-text text-transparent`} style={{ color: servizio.color.includes('blue') ? '#3b82f6' : servizio.color.includes('emerald') ? '#10b981' : servizio.color.includes('amber') ? '#f59e0b' : servizio.color.includes('purple') ? '#a855f7' : servizio.color.includes('rose') ? '#f43f5e' : servizio.color.includes('cyan') ? '#06b6d4' : '#6366f1' }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#018856] transition-colors">
                    {servizio.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm">
                    {servizio.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-4">
                    {servizio.highlights.slice(0, 3).map((highlight, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#018856] mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <div className="flex items-center text-[#018856] font-semibold text-sm group-hover:gap-2 transition-all">
                    Scopri di più
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#018856] to-emerald-600" />
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Hai bisogno di assistenza?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              I nostri sportelli sono a disposizione per offrirti consulenza e supporto
              in tutte le questioni legate al lavoro e alla vita quotidiana.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contatti">
                <Button size="lg" className="bg-white text-[#018856] hover:bg-gray-100 px-8 py-6 font-bold rounded-xl shadow-lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Contattaci ora
                </Button>
              </Link>
              <Link href="/chi-siamo">
                <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                  Scopri chi siamo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
