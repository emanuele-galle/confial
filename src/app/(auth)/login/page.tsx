"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { IndustrialGrid } from "@/components/backgrounds/industrial-grid";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email o password non validi");
      } else {
        router.push("/admin");
      }
    } catch (error) {
      setError("Errore durante il login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden font-['IBM_Plex_Sans']">
      {/* Industrial background */}
      <IndustrialGrid />

      {/* Skip to main content - accessibility */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#018856] focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Salta al form di login
      </a>

      <div className="relative z-10 w-full max-w-6xl mx-4 lg:mx-8 flex items-center justify-center lg:justify-end">
        {/* Split screen layout - Desktop only */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-start lg:mr-16">
          {/* Branding section - institutional presence */}
          <div className="space-y-8 max-w-lg animate-fade-in-up">
            {/* Logo area - FAILMS emblem */}
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#018856] to-emerald-700 rounded-lg shadow-2xl shadow-[#018856]/40 relative">
                {/* Gear icon - industrial symbolism */}
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {/* Geometric accent */}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-500 rounded-sm transform rotate-45" />
              </div>
            </div>

            <div>
              <h1 className="text-5xl font-bold text-white mb-3 font-['Fraunces'] leading-tight tracking-tight">
                Dashboard
                <br />
                <span className="text-[#4ade80]">Amministrativa</span>
              </h1>
              <p className="text-gray-300 text-lg font-medium tracking-wide">
                CONFIAL FAILMS
              </p>
              <div className="mt-6 flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-12 h-px bg-[#018856]" />
                <span>Federazione Autonoma Italiana</span>
              </div>
            </div>

            {/* Industrial stats/metrics - institutional credibility */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#4ade80] font-mono">
                  24/7
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  Operativo
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#4ade80] font-mono">
                  100%
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  Sicuro
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login card - precision engineered */}
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile branding - shows only on small screens */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#018856] to-emerald-700 rounded-lg shadow-2xl shadow-[#018856]/40 mb-4 relative">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-amber-500 rounded-sm transform rotate-45" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 font-['Fraunces']">
              Dashboard Amministrativa
            </h1>
            <p className="text-gray-400 text-sm tracking-wide">CONFIAL FAILMS</p>
          </div>

          {/* Form card with subtle metallic border */}
          <div className="relative animate-slide-in-right">
            {/* Card glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#018856] via-emerald-600 to-[#018856] rounded-2xl blur opacity-20" />

            <div className="relative bg-gradient-to-b from-[#0f1f1a] to-[#0a1612] rounded-2xl border border-[#018856]/30 shadow-2xl overflow-hidden">
              {/* Metallic edge effect */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4ade80]/50 to-transparent" />

              <div className="p-8 sm:p-10">
                <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Error alert with better accessibility */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="bg-red-900/30 border-2 border-red-500/50 text-red-200 px-4 py-3.5 rounded-lg text-sm font-medium flex items-start gap-3 animate-shake"
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Email field with full accessibility */}
                  <div>
                    <label
                      htmlFor="email-input"
                      className="block text-sm font-bold text-gray-200 mb-2 uppercase tracking-wider"
                    >
                      Email
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#018856] transition-colors">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        aria-required="true"
                        aria-label="Indirizzo email"
                        className="w-full pl-12 pr-4 py-3.5 bg-[#0a1612]/50 border-2 border-[#018856]/30 rounded-lg focus:ring-2 focus:ring-[#018856]/50 focus:border-[#018856] transition-all text-white placeholder:text-gray-500 font-medium hover:border-[#018856]/50"
                        placeholder="admin@confial.it"
                      />
                    </div>
                  </div>

                  {/* Password field with full accessibility */}
                  <div>
                    <label
                      htmlFor="password-input"
                      className="block text-sm font-bold text-gray-200 mb-2 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#018856] transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        id="password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        aria-required="true"
                        aria-label="Password"
                        className="w-full pl-12 pr-4 py-3.5 bg-[#0a1612]/50 border-2 border-[#018856]/30 rounded-lg focus:ring-2 focus:ring-[#018856]/50 focus:border-[#018856] transition-all text-white placeholder:text-gray-500 font-medium hover:border-[#018856]/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Submit button - industrial CTA */}
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#018856] to-emerald-600 hover:from-[#016b45] hover:to-emerald-700 text-white font-bold text-base py-6 shadow-lg shadow-[#018856]/30 hover:shadow-[#018856]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider relative overflow-hidden group"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    {loading ? (
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Accesso in corso...</span>
                      </div>
                    ) : (
                      <span className="relative z-10">Accedi al Sistema</span>
                    )}
                  </Button>
                </form>

                {/* Footer with better contrast */}
                <div className="mt-8 pt-6 border-t border-[#018856]/20 text-center space-y-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Dashboard Amministrativa Sicura
                  </p>
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse" />
                    Sistema Operativo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations in globals.css */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.15;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
