import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, FileText, Users, TrendingUp, Eye } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Get counts
  const [newsCount, documentsCount, usersCount, publishedNewsCount] =
    await Promise.all([
      prisma.news.count(),
      prisma.document.count(),
      prisma.user.count(),
      prisma.news.count({ where: { status: "PUBLISHED" } }),
    ]);

  // Get recent news
  const recentNews = await prisma.news.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  // Get most downloaded documents
  const topDocuments = await prisma.document.findMany({
    take: 5,
    orderBy: { downloadCount: "desc" },
    where: {
      downloadCount: {
        gt: 0,
      },
    },
    include: {
      uploadedBy: { select: { name: true } },
    },
  });

  // Get total downloads
  const totalDownloads = await prisma.document.aggregate({
    _sum: {
      downloadCount: true,
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Benvenuto, {session?.user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Panoramica della dashboard amministrativa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="News Totali"
          value={newsCount}
          icon={Newspaper}
          color="emerald"
        />
        <StatCard
          title="News Pubblicate"
          value={publishedNewsCount}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Documenti"
          value={documentsCount}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Download Totali"
          value={totalDownloads._sum.downloadCount || 0}
          icon={Eye}
          color="orange"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-[#018856]" />
              News Recenti
            </h2>
            <Link
              href="/admin/news"
              className="text-sm text-[#018856] hover:text-[#016b43] font-medium"
            >
              Vedi tutte →
            </Link>
          </div>

          <div className="space-y-3">
            {recentNews.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Nessuna news ancora creata
              </p>
            ) : (
              recentNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/admin/news/${news.id}/edit`}
                  className="flex items-start justify-between py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {news.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      di {news.author.name} •{" "}
                      {new Date(news.createdAt).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                      news.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {news.status === "PUBLISHED" ? "Pubblicato" : "Bozza"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top Documents */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#018856]" />
              Documenti Più Scaricati
            </h2>
            <Link
              href="/admin/documents"
              className="text-sm text-[#018856] hover:text-[#016b43] font-medium"
            >
              Vedi tutti →
            </Link>
          </div>

          <div className="space-y-3">
            {topDocuments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Nessun documento ancora scaricato
              </p>
            ) : (
              topDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {doc.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doc.uploadedBy.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0 ml-3">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{doc.downloadCount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-[#018856] to-[#016b43] rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/news/new"
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 transition-colors"
          >
            <Newspaper className="h-6 w-6 mb-2" />
            <p className="font-medium">Crea News</p>
            <p className="text-sm text-white/80 mt-1">
              Pubblica una nuova news
            </p>
          </Link>

          <Link
            href="/admin/documents/new"
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 transition-colors"
          >
            <FileText className="h-6 w-6 mb-2" />
            <p className="font-medium">Carica Documento</p>
            <p className="text-sm text-white/80 mt-1">
              Aggiungi un nuovo PDF
            </p>
          </Link>

          <Link
            href="/admin/users/new"
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 transition-colors"
          >
            <Users className="h-6 w-6 mb-2" />
            <p className="font-medium">Aggiungi Utente</p>
            <p className="text-sm text-white/80 mt-1">
              Crea nuovo amministratore
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
