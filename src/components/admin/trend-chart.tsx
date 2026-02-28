"use client";

import { useState, useEffect } from "react";
import { AreaChart, Card, Tab, TabGroup, TabList } from "@tremor/react";
import { TrendingUp } from "lucide-react";

type TimeRange = "7d" | "30d" | "90d";

interface TrendDataPoint {
  date: string;
  News: number;
  Events: number;
  Documents: number;
}

export default function TrendChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30d");
  const [data, setData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/stats/trend?range=${selectedRange}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Failed to fetch trend data:", error);

        // Fallback: generate empty data structure to prevent chart crash
        const days = selectedRange === "7d" ? 7 : selectedRange === "30d" ? 30 : 90;
        const fallbackData: TrendDataPoint[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          fallbackData.push({
            date: date.toLocaleDateString("it-IT", { day: "numeric", month: "short" }),
            News: 0,
            Events: 0,
            Documents: 0,
          });
        }

        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendData();
  }, [selectedRange]);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Premium header with gradient */}
      <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-white to-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#018856] to-[#016643] rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Andamento Contenuti</h2>
              <p className="text-xs text-gray-500 mt-1">
                {selectedRange === "7d" ? "Ultimi 7 giorni" : selectedRange === "30d" ? "Ultimi 30 giorni" : "Ultimi 90 giorni"}
              </p>
            </div>
          </div>

          <TabGroup
            index={selectedRange === "7d" ? 0 : selectedRange === "30d" ? 1 : 2}
            onIndexChange={(index) => {
              const ranges: TimeRange[] = ["7d", "30d", "90d"];
              setSelectedRange(ranges[index]);
            }}
          >
            <TabList variant="solid" className="bg-gray-100 border border-gray-200 shadow-sm rounded-xl">
              <Tab className="data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-[#018856] data-[selected=true]:to-[#016643] data-[selected=true]:text-white data-[selected=true]:font-bold data-[selected=true]:shadow-md transition-all duration-200 text-sm">
                7 giorni
              </Tab>
              <Tab className="data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-[#018856] data-[selected=true]:to-[#016643] data-[selected=true]:text-white data-[selected=true]:font-bold data-[selected=true]:shadow-md transition-all duration-200 text-sm">
                30 giorni
              </Tab>
              <Tab className="data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-[#018856] data-[selected=true]:to-[#016643] data-[selected=true]:text-white data-[selected=true]:font-bold data-[selected=true]:shadow-md transition-all duration-200 text-sm">
                90 giorni
              </Tab>
            </TabList>
          </TabGroup>
        </div>
      </div>

      <div className="px-4 py-6 pb-8 bg-gradient-to-b from-white to-gray-50/50">
        {loading ? (
          <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        ) : (
          <div
            role="img"
            aria-label={`Grafico andamento: contenuti creati negli ultimi ${selectedRange === "7d" ? "7 giorni" : selectedRange === "30d" ? "30 giorni" : "90 giorni"}`}
            className="overflow-visible min-h-96"
          >
            <AreaChart
              className="h-96 w-full mt-2"
              data={data}
              index="date"
              categories={["News", "Events", "Documents"]}
              colors={["emerald", "blue", "violet"]}
              valueFormatter={(value) => `${value}`}
              showLegend={false}
              showGridLines={true}
              showXAxis={true}
              showYAxis={true}
              autoMinValue={true}
              minValue={0}
              curveType="monotone"
              showAnimation={true}
              animationDuration={800}
              yAxisWidth={40}
              enableLegendSlider={false}
              connectNulls={true}
            />
            {/* Fallback table for screen readers (A11Y-04) */}
            <table className="sr-only">
              <caption>Dati grafico andamento contenuti</caption>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>News</th>
                  <th>Eventi</th>
                  <th>Documenti</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i}>
                    <td>{d.date}</td>
                    <td>{d.News}</td>
                    <td>{d.Events}</td>
                    <td>{d.Documents}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Legend enhancement */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-xl shadow-sm">
                <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-sm" />
                <span className="font-bold text-emerald-700">News</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-xl shadow-sm">
                <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-sm" />
                <span className="font-bold text-blue-700">Eventi</span>
              </div>
              <div className="flex items-center gap-2 bg-violet-100 px-4 py-2 rounded-xl shadow-sm">
                <div className="w-3 h-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full shadow-sm" />
                <span className="font-bold text-violet-700">Documenti</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
