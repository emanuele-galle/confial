"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  organizzazione: [
    { name: "Chi siamo", href: "/chi-siamo" },
    { name: "Settori", href: "/settori" },
    { name: "Contrattazione", href: "/contrattazione/nazionale" },
    { name: "News", href: "/news" },
  ],
  servizi: [
    { name: "Servizi fiscali (CAF)", href: "/servizi/caf" },
    { name: "Patronato", href: "/servizi/patronato" },
    { name: "Consulenza legale", href: "/servizi/legale" },
    { name: "Vertenze", href: "/servizi/vertenze" },
  ],
  risorse: [
    { name: "CONFIAL TV", href: "https://confialtv.it", external: true },
    { name: "Contatti", href: "/contatti" },
    { name: "Come aderire", href: "/contatti" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/benedetto.diiacovo", icon: Facebook },
  { name: "YouTube", href: "https://confialtv.it", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 hidden sm:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-4 sm:mb-6">
              <div className="relative w-64 sm:w-80 h-20 sm:h-28">
                <Image
                  src="/images/logo-failms-new.png"
                  alt="FAILMS CONFIAL Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 max-w-md leading-relaxed">
              Federazione Autonoma Italiana Lavoratori Metalmeccanici e Servizi.
              <br />
              Il sindacato dell&apos;industria che difende i diritti, governa le transizioni
              e costruisce futuro nei luoghi di lavoro.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-800/50 hover:bg-[#018856] rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/20"
                >
                  <social.icon className="h-4 sm:h-5 w-4 sm:w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Organizzazione</h4>
            <ul className="space-y-3">
              {footerLinks.organizzazione.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Servizi</h4>
            <ul className="space-y-3">
              {footerLinks.servizi.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Risorse</h4>
            <ul className="space-y-3">
              {footerLinks.risorse.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-emerald-400 mr-0 group-hover:mr-2 transition-all duration-200" />
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-emerald-400 mr-0 group-hover:mr-2 transition-all duration-200" />
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap gap-8 text-sm">
            <a href="mailto:failm.nazionale@confial.it" className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group">
              <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-900/30 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              failm.nazionale@confial.it
            </a>
            <a href="tel:+390815538186" className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group">
              <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-900/30 transition-colors">
                <Phone className="h-4 w-4" />
              </div>
              0815538186
            </a>
            <span className="flex items-center text-gray-400">
              <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="h-4 w-4" />
              </div>
              Piazza Giuseppe Garibaldi n.39 – 80143 Napoli
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FAILMS - CONFIAL. Tutti i diritti riservati.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie" className="text-gray-500 hover:text-emerald-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
