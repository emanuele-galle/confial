"use client";

import { useState, useEffect } from "react";
import { AreaChart, Card, Tab, TabGroup, TabList } from "@tremor/react";

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
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Andamento Contenuti</h2>
          <p className="text-sm text-gray-500 mt-1">
            Creazioni negli ultimi {selectedRange === "7d" ? "7 giorni" : selectedRange === "30d" ? "30 giorni" : "90 giorni"}
          </p>
        </div>

        <TabGroup
          index={selectedRange === "7d" ? 0 : selectedRange === "30d" ? 1 : 2}
          onIndexChange={(index) => {
            const ranges: TimeRange[] = ["7d", "30d", "90d"];
            setSelectedRange(ranges[index]);
          }}
        >
          <TabList variant="solid" className="bg-gray-100">
            <Tab>7 giorni</Tab>
            <Tab>30 giorni</Tab>
            <Tab>90 giorni</Tab>
          </TabList>
        </TabGroup>
      </div>

      {loading ? (
        <div className="h-80 bg-gray-100 animate-pulse rounded-xl" />
      ) : (
        <div
          role="img"
          aria-label={`Grafico andamento: contenuti creati negli ultimi ${selectedRange === "7d" ? "7 giorni" : selectedRange === "30d" ? "30 giorni" : "90 giorni"}`}
        >
          <AreaChart
            className="h-80"
            data={data}
            index="date"
            categories={["News", "Events", "Documents"]}
            colors={["emerald", "blue", "purple"]}
            valueFormatter={(value) => `${value}`}
            showLegend={true}
            showGridLines={true}
            showXAxis={true}
            showYAxis={true}
            autoMinValue={true}
            curveType="natural"
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
        </div>
      )}
    </Card>
  );
}
