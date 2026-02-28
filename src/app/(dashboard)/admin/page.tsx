import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, FileText, Users, TrendingUp, Eye, ArrowUpRight, Download } from "lucide-react";
import { StatCardMinimal } from "@/components/admin/stat-card-minimal";
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-br from-[#018856] to-[#016643] rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-3">
              <span>Home</span>
              <span>/</span>
              <span className="text-white font-medium">Dashboard</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Benvenuto, {session?.user?.name?.split(' ')[0] || 'Admin'}
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Ecco una panoramica delle tue attività recenti
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-white/70">Ultimo accesso</p>
              <p className="text-sm font-medium text-white">
                {new Date().toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCardMinimal
          title="News Totali"
          value={stats.newsCount}
          iconName="newspaper"
          change={stats.newsChange}
        />
        <StatCardMinimal
          title="News Pubblicate"
          value={stats.publishedNewsCount}
          iconName="trendingUp"
          change={stats.publishedNewsChange}
        />
        <StatCardMinimal
          title="Documenti"
          value={stats.documentsCount}
          iconName="fileText"
          change={stats.documentsChange}
        />
        <StatCardMinimal
          title="Download Totali"
          value={stats.downloadsCount}
          iconName="eye"
          change={stats.downloadsChange}
        />
      </div>

      {/* Trend Chart & Activity Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News - Enhanced */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-white to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Newspaper className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">News Recenti</h2>
            </div>
            <Link
              href="/admin/news"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              Vedi tutte
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentNews.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Newspaper className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">Nessuna news pubblicata</p>
                <Link
                  href="/admin/news/new"
                  className="text-sm text-gray-900 hover:text-[#018856] font-medium underline underline-offset-4 transition-colors"
                >
                  Crea la prima news
                </Link>
              </div>
            ) : (
              recentNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/admin/news/${news.id}/edit`}
                  className="flex items-start justify-between px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                      {news.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                      <span className="font-medium">{news.author.name}</span>
                      <span className="text-gray-300">•</span>
                      <span>
                        {new Date(news.createdAt).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                      news.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {news.status === "PUBLISHED" ? "Pubblicato" : "Bozza"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top Documents - Enhanced */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 via-white to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Documenti Popolari</h2>
            </div>
            <Link
              href="/admin/documents"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              Vedi tutti
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {topDocuments.length === 0 ? (
              <div className="text-center py-16 px-4">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">Nessun documento</p>
                <Link
                  href="/admin/documents/new"
                  className="text-sm text-gray-900 hover:text-[#018856] font-medium underline underline-offset-4 transition-colors"
                >
                  Carica documento
                </Link>
              </div>
            ) : (
              topDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-transparent transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {doc.uploadedBy.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg group-hover:bg-violet-100 transition-colors">
                    <Download className="h-4 w-4 text-gray-600 group-hover:text-violet-700" />
                    <span className="text-sm font-bold tabular-nums text-gray-900 group-hover:text-violet-700">
                      {doc.downloadCount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#018856] to-[#016643] rounded-xl flex items-center justify-center shadow-md">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Azioni Rapide</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/news/new"
            className="relative flex items-start gap-4 p-5 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 group border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Newspaper className="h-7 w-7 text-white" />
            </div>
            <div className="relative flex-1">
              <p className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Crea News
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Nuova notizia
              </p>
            </div>
          </Link>

          <Link
            href="/admin/documents/new"
            className="relative flex items-start gap-4 p-5 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 group border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-500 to-violet-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div className="relative flex-1">
              <p className="text-base font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                Carica Documento
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Nuovo PDF
              </p>
            </div>
          </Link>

          <Link
            href="/admin/events/new"
            className="relative flex items-start gap-4 p-5 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 group border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div className="relative flex-1">
              <p className="text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                Crea Evento
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Nuovo evento
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
