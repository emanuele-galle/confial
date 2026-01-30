import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, FileText, Users, TrendingUp, Eye, ArrowUpRight } from "lucide-react";
import { StatCardEnhanced } from "@/components/admin/stat-card-enhanced";
import { ActivityFeed } from "@/components/admin/activity-feed";
import Link from "next/link";
import dynamic from "next/dynamic";

// Code-split TrendChart (Tremor bundle ~140KB)
const TrendChart = dynamic(
  () => import("@/components/admin/trend-chart"),
  {
    loading: () => (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
      </div>
    ),
  }
);

export default async function AdminDashboardPage() {
  const session = await auth();

  // Calculate stats directly with Prisma (avoid SSR fetch auth issues)
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  // Parallel queries for performance
  const [
    newsCount,
    publishedNewsCount,
    newsLast7Days,
    newsPrevious7Days,
    documentsCount,
    documentsLast7Days,
    documentsPrevious7Days,
    downloadsCount,
    downloadsLast7Days,
    downloadsPrevious7Days,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.news.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.news.count({
      where: {
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    }),
    prisma.document.count(),
    prisma.document.count({ where: { uploadedAt: { gte: sevenDaysAgo } } }),
    prisma.document.count({
      where: {
        uploadedAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    }),
    // Use AuditLog for accurate download tracking (not downloadCount field)
    prisma.auditLog.count({
      where: { action: "DOCUMENT_DOWNLOAD" }
    }),
    prisma.auditLog.count({
      where: {
        action: "DOCUMENT_DOWNLOAD",
        createdAt: { gte: sevenDaysAgo }
      }
    }),
    prisma.auditLog.count({
      where: {
        action: "DOCUMENT_DOWNLOAD",
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    }),
  ]);

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) {
      return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
    }
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(Math.round(change)), isPositive: change >= 0 };
  };

  // Generate sparkline data (last 7 days)
  const sparklineData = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      return Promise.all([
        prisma.news.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.document.count({
          where: {
            uploadedAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.auditLog.count({
          where: {
            action: "DOCUMENT_DOWNLOAD",
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
      ]);
    })
  );

  const stats = {
    newsCount,
    publishedNewsCount,
    documentsCount,
    downloadsCount,
    newsSparkline: sparklineData.map(d => d[0]),
    publishedNewsSparkline: sparklineData.map(d => d[0]), // Same as news for now
    documentsSparkline: sparklineData.map(d => d[1]),
    downloadsSparkline: sparklineData.map(d => d[2]),
    newsChange: calculateChange(newsLast7Days, newsPrevious7Days),
    publishedNewsChange: calculateChange(newsLast7Days, newsPrevious7Days),
    documentsChange: calculateChange(documentsLast7Days, documentsPrevious7Days),
    downloadsChange: calculateChange(downloadsLast7Days, downloadsPrevious7Days),
  };

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


  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-[#018856] via-[#016b43] to-[#015a3d] rounded-2xl p-8 shadow-xl"
        role="banner"
        aria-label="Dashboard header"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Benvenuto, {session?.user?.name || session?.user?.email?.split('@')[0] || 'Admin'}! 👋
          </h1>
          <p className="text-emerald-100 text-lg font-medium">
            Gestisci i contenuti della piattaforma FAILMS
          </p>
        </div>
      </div>

      {/* Stats Grid - Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCardEnhanced
          title="News Totali"
          value={stats.newsCount}
          iconName="newspaper"
          variant="primary"
          sparkline={stats.newsSparkline}
          change={stats.newsChange}
        />
        <StatCardEnhanced
          title="News Pubblicate"
          value={stats.publishedNewsCount}
          iconName="trendingUp"
          variant="secondary"
          sparkline={stats.publishedNewsSparkline}
          change={stats.publishedNewsChange}
        />
        <StatCardEnhanced
          title="Documenti"
          value={stats.documentsCount}
          iconName="fileText"
          variant="tertiary"
          sparkline={stats.documentsSparkline}
          change={stats.documentsChange}
        />
        <StatCardEnhanced
          title="Download Totali"
          value={stats.downloadsCount}
          iconName="eye"
          variant="accent"
          sparkline={stats.downloadsSparkline}
          change={stats.downloadsChange}
        />
      </div>

      {/* Trend Chart & Activity Feed Row - Responsive: stack on mobile/tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Two Column Layout - Responsive: stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

      {/* Quick Actions - Tema chiaro con accent CONFIAL verde */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-[#018856] to-[#016b43] rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          Azioni Rapide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href="/admin/news/new"
            className="group bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#018856] to-[#016b43] group-hover:shadow-lg rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-lg mb-2 text-gray-800">Crea News</p>
            <p className="text-sm text-gray-600">
              Pubblica una nuova notizia
            </p>
          </Link>

          <Link
            href="/admin/documents/new"
            className="group bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-lg rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-lg mb-2 text-gray-800">Carica Documento</p>
            <p className="text-sm text-gray-600">
              Aggiungi un nuovo PDF
            </p>
          </Link>

          <Link
            href="/admin/events/new"
            className="group bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 group-hover:shadow-lg rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-lg mb-2 text-gray-800">Crea Evento</p>
            <p className="text-sm text-gray-600">
              Pianifica un nuovo evento
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
