import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function NewsListPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News</h1>
          <p className="text-gray-600">Gestisci le news del sito</p>
        </div>

        <Link href="/admin/news/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crea News
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Titolo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Autore
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Data
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nessuna news ancora creata. Clicca su "Crea News" per iniziare.
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">/news/{item.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.author.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status === "PUBLISHED" ? "Pubblicato" : "Bozza"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/news/${item.id}/edit`}
                      className="text-[#018856] hover:text-[#016b43] font-medium text-sm"
                    >
                      Modifica
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
