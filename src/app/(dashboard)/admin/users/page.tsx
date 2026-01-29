"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Shield, User } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  lastLoginAt: string | null;
  _count: {
    newsArticles: number;
    documents: number;
  };
}

export default function UsersListPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");

      if (response.status === 403) {
        setError("Non hai i permessi per visualizzare gli utenti");
        return;
      }

      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Errore nel caricamento degli utenti");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Sei sicuro di voler eliminare questo utente?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Utente eliminato con successo!");
        setUsers(users.filter((user) => user.id !== id));
      } else {
        const error = await response.json();
        toast.error(error.error || "Errore durante l'eliminazione");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Utenti</h1>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Utenti</h1>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Utenti</h1>
          <p className="text-gray-600 mt-1">Gestisci gli utenti amministratori ({users.length} totali)</p>
        </div>

        <Link href="/admin/users/new">
          <Button className="bg-[#018856] hover:bg-[#016b43] shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Crea Utente
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-[#018856]/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ruolo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Attività
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ultimo Accesso
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#018856] rounded-lg flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
                      user.role === "SUPER_ADMIN"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {user.role === "SUPER_ADMIN" ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user._count.newsArticles} news • {user._count.documents}{" "}
                  documenti
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString("it-IT")
                    : "Mai"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Modifica
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
