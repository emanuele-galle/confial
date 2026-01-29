import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, FileText, Users, TrendingUp, Eye, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Get counts
  const [newsCount, documentsCount, usersCount, publishedNewsCount, eventsCount] =
    await Promise.all([
      prisma.news.count(),
      prisma.document.count(),
      prisma.user.count(),
      prisma.news.count({ where: { status: "PUBLISHED" } }),
      prisma.event.count(),
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
      <div className="relative overflow-hidden bg-gradient-to-br from-[#018856] via-[#016b43] to-[#015a3d] rounded-2xl p-8 shadow-xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Benvenuto, {session?.user?.name}! 👋
          </h1>
          <p className="text-emerald-100 text-lg font-medium">
            Gestisci i contenuti della piattaforma FAILMS
          </p>
        </div>
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Newspaper className="h-5 w-5 text-[#018856]" />
                </div>
                News Recenti
              </h2>
              <Link
                href="/admin/news"
                className="text-sm text-[#018856] hover:text-[#016b43] font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Vedi tutte
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {recentNews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Newspaper className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Nessuna news ancora creata
                  </p>
                  <Link href="/admin/news/new">
                    <span className="text-sm text-[#018856] hover:text-[#016b43] font-semibold">
                      Crea la prima news →
                    </span>
                  </Link>
                </div>
              ) : (
                recentNews.map((news) => (
                  <Link
                    key={news.id}
                    href={`/admin/news/${news.id}/edit`}
                    className="flex items-start justify-between p-4 hover:bg-gray-50 rounded-xl transition-all group border border-transparent hover:border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 group-hover:text-[#018856] transition-colors truncate">
                        {news.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        di {news.author.name} •{" "}
                        {new Date(news.createdAt).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        news.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {news.status === "PUBLISHED" ? "Pubblicato" : "Bozza"}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Documents */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                Documenti Popolari
              </h2>
              <Link
                href="/admin/documents"
                className="text-sm text-[#018856] hover:text-[#016b43] font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Vedi tutti
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {topDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Nessun documento ancora scaricato
                  </p>
                  <Link href="/admin/documents/new">
                    <span className="text-sm text-[#018856] hover:text-[#016b43] font-semibold">
                      Carica il primo documento →
                    </span>
                  </Link>
                </div>
              ) : (
                topDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {doc.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doc.uploadedBy.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg flex-shrink-0 ml-3">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold text-gray-700 text-sm">
                        {doc.downloadCount}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-8 text-white shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#018856] rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          Azioni Rapide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/news/new"
            className="group bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 hover:border-[#018856]/50 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="w-12 h-12 bg-emerald-500/20 group-hover:bg-emerald-500/30 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <Newspaper className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="font-bold text-lg mb-2 text-white">Crea News</p>
            <p className="text-sm text-gray-400">
              Pubblica una nuova notizia
            </p>
          </Link>

          <Link
            href="/admin/documents/new"
            className="group bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 hover:border-blue-500/50 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="w-12 h-12 bg-blue-500/20 group-hover:bg-blue-500/30 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <p className="font-bold text-lg mb-2 text-white">Carica Documento</p>
            <p className="text-sm text-gray-400">
              Aggiungi un nuovo PDF
            </p>
          </Link>

          <Link
            href="/admin/events/new"
            className="group bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 hover:border-purple-500/50 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="w-12 h-12 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <p className="font-bold text-lg mb-2 text-white">Crea Evento</p>
            <p className="text-sm text-gray-400">
              Pianifica un nuovo evento
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
