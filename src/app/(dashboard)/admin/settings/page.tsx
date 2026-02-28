"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Lock, User, Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      if (response.ok) {
        toast.success("Password aggiornata con successo!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        toast.error(error.error || "Errore nel cambio password");
      }
    } catch (error) {
      toast.error("Errore di rete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Impostazioni</h1>
        <p className="text-gray-600">Gestisci le impostazioni del tuo account</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <User className="h-5 w-5 text-[#018856]" />
          <h2 className="text-lg font-semibold text-gray-900">
            Informazioni Account
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
              {session?.user?.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
              {session?.user?.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ruolo
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium border ${
                  (session?.user as { role?: string })?.role === "SUPER_ADMIN"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {(session?.user as { role?: string })?.role === "SUPER_ADMIN" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                {(session?.user as { role?: string })?.role === "SUPER_ADMIN"
                  ? "Super Admin"
                  : "Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <Lock className="h-5 w-5 text-[#018856]" />
          <h2 className="text-lg font-semibold text-gray-900">
            Cambia Password
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Attuale *
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              placeholder="Inserisci la password attuale"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuova Password *
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              required
              minLength={8}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              placeholder="Minimo 8 caratteri"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conferma Nuova Password *
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              required
              minLength={8}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              placeholder="Ripeti la nuova password"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} size="lg" className="bg-[#018856] hover:bg-[#016b43] shadow-lg">
              {loading ? "Aggiornamento..." : "Aggiorna Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
        <h3 className="font-semibold text-emerald-900 mb-3">
          Suggerimenti per la Sicurezza
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span>Usa una password forte con lettere, numeri e simboli</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span>Non condividere mai la tua password con altri</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span>Cambia la password periodicamente (ogni 3-6 mesi)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span>Esci sempre dopo aver terminato il lavoro</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
