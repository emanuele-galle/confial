import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, FileText, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  const [newsCount, documentsCount, usersCount] = await Promise.all([
    prisma.news.count(),
    prisma.document.count(),
    prisma.user.count(),
  ]);

  const recentNews = await prisma.news.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const stats = [
    { name: "News Totali", value: newsCount, icon: Newspaper, color: "emerald" },
    { name: "Documenti", value: documentsCount, icon: FileText, color: "blue" },
    { name: "Utenti", value: usersCount, icon: Users, color: "purple" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Benvenuto, {session?.user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Panoramica della dashboard amministrativa
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          News Recenti
        </h2>
        <div className="space-y-3">
          {recentNews.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Nessuna news ancora creata
            </p>
          ) : (
            recentNews.map((news) => (
              <div
                key={news.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{news.title}</p>
                  <p className="text-sm text-gray-500">
                    di {news.author.name} • {new Date(news.createdAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    news.status === "PUBLISHED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {news.status === "PUBLISHED" ? "Pubblicato" : "Bozza"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
