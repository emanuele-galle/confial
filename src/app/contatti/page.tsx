"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Facebook,
  Tv,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const contatti = [
  {
    icon: Mail,
    title: "Email",
    value: "failm.nazionale@confial.it",
    href: "mailto:failm.nazionale@confial.it",
    color: "emerald",
  },
  {
    icon: Phone,
    title: "Telefono",
    value: "0815538186",
    href: "tel:+390815538186",
    color: "blue",
  },
  {
    icon: MapPin,
    title: "Sede Nazionale",
    value: "Piazza Giuseppe Garibaldi n.39 – 80143 Napoli",
    href: null,
    color: "rose",
  },
  {
    icon: Clock,
    title: "Orari Ufficio",
    value: "Lun - Ven: 9-18",
    href: null,
    color: "amber",
  },
];

const motivoOptions = [
  "Richiesta informazioni",
  "Voglio aderire",
  "Assistenza sindacale",
  "Servizi CAF/Patronato",
  "Consulenza legale",
  "Altro",
];

export default function ContattiPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
    azienda: "",
    motivo: "",
    messaggio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula invio (sostituire con vera API)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Qui andrà la chiamata API reale
    console.log("Form data:", formData);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero compatto */}
      <section className="relative min-h-[30vh] sm:min-h-[35vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/servizi/contatti-ufficio.jpg"
            alt="Contatti FAILMS CONFIAL"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#018856]/95 to-emerald-700/80" />
        </div>

        <div className="relative z-10 min-h-[30vh] sm:min-h-[35vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-16 sm:py-20 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 sm:w-14 h-10 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Mail className="h-5 sm:h-7 w-5 sm:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white">Contattaci</h1>
                  <p className="text-white/70 text-sm">Siamo qui per aiutarti</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                Compila il form e ti ricontatteremo entro 24 ore lavorative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {contatti.map((contatto, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                  contatto.color === "emerald" ? "bg-emerald-100" :
                  contatto.color === "blue" ? "bg-blue-100" :
                  contatto.color === "rose" ? "bg-rose-100" : "bg-amber-100"
                }`}>
                  <contatto.icon className={`w-5 sm:w-6 h-5 sm:h-6 ${
                    contatto.color === "emerald" ? "text-emerald-600" :
                    contatto.color === "blue" ? "text-blue-600" :
                    contatto.color === "rose" ? "text-rose-600" : "text-amber-600"
                  }`} />
                </div>
                <h3 className="text-gray-900 font-bold text-xs sm:text-sm">{contatto.title}</h3>
                {contatto.href ? (
                  <a
                    href={contatto.href}
                    className="text-gray-600 hover:text-[#018856] transition-colors text-xs"
                  >
                    {contatto.value}
                  </a>
                ) : (
                  <p className="text-gray-600 text-xs">{contatto.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-20">
          {isSubmitted ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Messaggio inviato!</h2>
              <p className="text-gray-600 mb-6">
                Grazie per averci contattato. Ti risponderemo il prima possibile.
              </p>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ nome: "", email: "", telefono: "", azienda: "", motivo: "", messaggio: "" });
                }}
                variant="outline"
                className="border-[#018856] text-[#018856]"
              >
                Invia un altro messaggio
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Inviaci un messaggio</h2>
                <p className="text-gray-600 text-sm">Compila il form e ti ricontatteremo al più presto</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nome e Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome e Cognome *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#018856]/20 focus:border-[#018856] transition-colors text-sm"
                        placeholder="Mario Rossi"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#018856]/20 focus:border-[#018856] transition-colors text-sm"
                        placeholder="mario.rossi@email.it"
                      />
                    </div>
                  </div>
                </div>

                {/* Telefono e Azienda */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#018856]/20 focus:border-[#018856] transition-colors text-sm"
                        placeholder="+39 333 1234567"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="azienda" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Azienda (opzionale)
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="azienda"
                        name="azienda"
                        value={formData.azienda}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#018856]/20 focus:border-[#018856] transition-colors text-sm"
                        placeholder="Nome azienda"
                      />
                    </div>
                  </div>
                </div>

                {/* Motivo */}
                <div>
                  <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Motivo del contatto *
                  </label>
                  <select
                    id="motivo"
                    name="motivo"
                    required
                    value={formData.motivo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#018856]/20 focus:border-[#018856] transition-colors text-sm bg-white"
                  >
                    <option value="">Seleziona un motivo</option>
                    {motivoOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Messaggio */}
                <div>
                  <label htmlFor="messaggio" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Messaggio *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="messaggio"
                      name="messaggio"
                      required
                      rows={4}
                      value={formData.messaggio}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#018856]/20 focus:border-[#018856] transition-colors text-sm resize-none"
                      placeholder="Descrivi brevemente la tua richiesta..."
                    />
                  </div>
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1 w-4 h-4 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
                  />
                  <label htmlFor="privacy" className="text-xs text-gray-600">
                    Acconsento al trattamento dei dati personali ai sensi del GDPR.
                    I dati saranno utilizzati esclusivamente per rispondere alla richiesta.
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#018856] hover:bg-[#016d45] text-white py-4 font-bold rounded-xl text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Invia messaggio
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Social Links */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Seguici online</h2>
            <p className="text-gray-600 text-sm">Rimani aggiornato sulle nostre attività</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <a
              href="https://www.facebook.com/benedetto.diiacovo"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-sm">Facebook</h3>
                <p className="text-gray-500 text-xs">Seguici su Facebook</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>

            <a
              href="https://confialtv.it"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-sm">CONFIAL TV</h3>
                <p className="text-gray-500 text-xs">La nostra web TV</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
