import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Building2,
  Users,
  Target,
  ArrowRight,
  Scale,
  Briefcase,
  TrendingUp,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const livelli = [
  {
    name: "Contrattazione Nazionale",
    href: "/contrattazione/nazionale",
    icon: FileText,
    description: "Negoziazione dei CCNL dei settori metalmeccanici, siderurgici e comparti collegati",
    color: "from-blue-500 to-blue-600",
    features: [
      "Difesa dei salari reali",
      "Inquadramenti professionali",
      "Clausole su salute e sicurezza",
      "Formazione continua",
    ],
  },
  {
    name: "Secondo Livello",
    href: "/contrattazione/secondo-livello",
    icon: Building2,
    description: "Contrattazione aziendale e territoriale per integrare le tutele nazionali",
    color: "from-emerald-500 to-emerald-600",
    features: [
      "Premio di risultato",
      "Welfare aziendale",
      "Orario di lavoro flessibile",
      "Smart working",
    ],
  },
  {
    name: "Contrattazione Aziendale",
    href: "/contrattazione/aziendale",
    icon: Users,
    description: "Accordi specifici nelle singole realtà produttive",
    color: "from-amber-500 to-amber-600",
    features: [
      "Accordi di prossimità",
      "Gestione delle crisi",
      "Riorganizzazioni",
      "Tutele occupazionali",
    ],
  },
];

const principi = [
  {
    icon: Target,
    title: "Autonomia contrattuale",
    description: "Negoziazione libera da condizionamenti politico-partitici",
  },
  {
    icon: Scale,
    title: "Equità retributiva",
    description: "Difesa del potere d'acquisto e redistribuzione della produttività",
  },
  {
    icon: Shield,
    title: "Tutela dei diritti",
    description: "Protezione delle condizioni di lavoro e della dignità professionale",
  },
  {
    icon: TrendingUp,
    title: "Innovazione",
    description: "Accompagnamento delle transizioni tecnologiche e ambientali",
  },
];

const numeri = [
  { value: "50+", label: "Accordi firmati" },
  { value: "40+", label: "Anni di esperienza" },
  { value: "1000+", label: "Lavoratori tutelati" },
  { value: "20", label: "Regioni coperte" },
];

export default function ContrattazionePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/settori/siderurgia.jpg"
            alt="Contrattazione FAILMS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[60vh] flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Briefcase className="w-4 h-4 text-[#018856]" />
                <span className="text-white/90 text-sm font-medium">Il cuore della nostra attività</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Contrattazione<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018856] to-emerald-400">
                  collettiva
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed">
                La contrattazione è il cuore dell&apos;attività sindacale: negoziiamo condizioni
                di lavoro, salari e tutele a tutti i livelli per garantire dignità e sicurezza.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/contatti">
                  <Button size="lg" className="bg-[#018856] hover:bg-[#016b43] text-white px-8 py-6 text-base font-bold rounded-xl shadow-lg group">
                    Parla con noi
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#livelli">
                  <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl">
                    Scopri i livelli
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numeri */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {numeri.map((numero, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-[#018856] mb-2">
                  {numero.value}
                </div>
                <div className="text-gray-600 font-medium">{numero.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principi */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              I nostri principi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La nostra azione contrattuale si fonda su principi chiari che guidano ogni negoziazione.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principi.map((principio, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-[#018856]/10 rounded-xl flex items-center justify-center mb-4">
                  <principio.icon className="h-6 w-6 text-[#018856]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{principio.title}</h3>
                <p className="text-gray-600 text-sm">{principio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Livelli di contrattazione */}
      <section id="livelli" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Livelli di contrattazione
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Operiamo su tre livelli complementari per garantire tutele complete ai lavoratori.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {livelli.map((livello, index) => (
              <Link key={index} href={livello.href} className="group">
                <div className="bg-white rounded-2xl p-8 h-full border-2 border-gray-100 hover:border-[#018856]/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${livello.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <livello.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#018856] transition-colors">
                    {livello.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">
                    {livello.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {livello.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-[#018856] mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <div className="flex items-center text-[#018856] font-bold group-hover:gap-2 transition-all">
                    Approfondisci
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/settori/acciaieria-produzione.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Vuoi saperne di più sulla contrattazione?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              I nostri esperti sono a disposizione per illustrarti le tutele previste
              dal tuo contratto e le opportunità di miglioramento.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contatti">
                <Button size="lg" className="bg-[#018856] hover:bg-[#016b43] text-white px-8 py-6 font-bold rounded-xl shadow-lg">
                  Contattaci
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/chi-siamo">
                <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                  Chi siamo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
