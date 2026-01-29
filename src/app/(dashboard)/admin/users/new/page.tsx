"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UserCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "ADMIN" as "ADMIN" | "SUPER_ADMIN",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Utente creato con successo!");
        router.push("/admin/users");
      } else {
        const error = await response.json();
        toast.error(error.error || "Errore nella creazione dell'utente");
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
        <h1 className="text-3xl font-bold text-gray-800">Crea Utente</h1>
        <p className="text-gray-600">
          Crea un nuovo utente amministratore
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm border-gray-200 p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Nome Completo *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
            placeholder="Mario Rossi"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
            placeholder="mario.rossi@confial.it"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Password *
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            minLength={8}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
            placeholder="Minimo 8 caratteri"
          />
          <p className="text-xs text-gray-500 mt-1">
            La password deve contenere almeno 8 caratteri
          </p>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Ruolo *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "ADMIN" | "SUPER_ADMIN",
              })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
          >
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Super Admin può gestire utenti e ha accesso completo
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading} size="lg" className="bg-[#018856] hover:bg-[#016b43] shadow-lg">
            {loading ? "Creazione..." : "Crea Utente"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annulla
          </Button>
        </div>
      </form>
    </div>
  );
}
