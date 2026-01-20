"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Chi siamo", href: "/chi-siamo" },
  { name: "Settori", href: "/settori" },
  {
    name: "Servizi",
    href: "/servizi",
    children: [
      { name: "Servizi fiscali (CAF)", href: "/servizi/caf" },
      { name: "Patronato", href: "/servizi/patronato" },
      { name: "Sportello inquilinato", href: "/servizi/inquilinato" },
      { name: "Associazione consumatori", href: "/servizi/consumatori" },
      { name: "Consulenza legale", href: "/servizi/legale" },
      { name: "Conteggi e vertenze", href: "/servizi/vertenze" },
      { name: "Istituto studi", href: "/servizi/istituto-studi" },
    ],
  },
  {
    name: "Contrattazione",
    href: "/contrattazione",
    children: [
      { name: "Nazionale", href: "/contrattazione/nazionale" },
      { name: "Secondo livello", href: "/contrattazione/secondo-livello" },
      { name: "Aziendale", href: "/contrattazione/aziendale" },
    ],
  },
  { name: "WebTV", href: "https://confialtv.it/", external: true },
  { name: "News", href: "/news" },
  { name: "Contatti", href: "/contatti" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo/logo-confial-orizzontale.png"
                alt="FAILMS CONFIAL"
                width={280}
                height={94}
                className="h-16 sm:h-20 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#018856] transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#018856] transition-colors inline-flex items-center"
                    >
                      {item.name}
                      {item.children && (
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                  )}

                  {/* Desktop Dropdown */}
                  {item.children && (
                    <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#018856]"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop CTA */}
            <Link
              href="/contatti"
              className="hidden lg:inline-flex items-center px-6 py-2.5 bg-[#018856] text-white text-sm font-semibold rounded-full hover:bg-[#016b43] transition-colors"
            >
              Aderisci ora
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#018856] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#018856]"
              aria-expanded={isOpen}
              aria-label="Menu principale"
            >
              <span className="sr-only">Apri menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Completely separate from header */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Image
                src="/images/logo/logo-confial-orizzontale.png"
                alt="FAILMS CONFIAL"
                width={200}
                height={67}
                className="h-14 w-auto"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:text-[#018856] hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
              {navigation.map((item) => (
                <div key={item.name} className="border-b border-gray-100 last:border-0">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="flex items-center justify-between w-full py-3 text-base font-medium text-gray-900 hover:text-[#018856]"
                      >
                        {item.name}
                        <svg
                          className={`w-5 h-5 transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openSubmenu === item.name && (
                        <div className="pb-3 pl-4 space-y-2">
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-sm text-[#018856] font-medium"
                          >
                            Vedi tutti
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-sm text-gray-600 hover:text-[#018856]"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-3 text-base font-medium text-gray-900 hover:text-[#018856]"
                    >
                      {item.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 text-base font-medium text-gray-900 hover:text-[#018856]"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="p-4 border-t">
              <Link
                href="/contatti"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-6 py-3 bg-[#018856] text-white font-semibold rounded-lg hover:bg-[#016b43] transition-colors"
              >
                Aderisci ora
              </Link>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">FAILMS CONFIAL - Sindacato Autonomo</p>
              <p className="text-xs text-gray-400 mt-1">Dal 1984 al fianco dei lavoratori</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
