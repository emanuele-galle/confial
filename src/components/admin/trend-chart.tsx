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
        // For now, generate sample data client-side
        // In production, this would fetch from /api/admin/stats/trend?range={selectedRange}
        const days = selectedRange === "7d" ? 7 : selectedRange === "30d" ? 30 : 90;
        const trendData: TrendDataPoint[] = [];

        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);

          trendData.push({
            date: date.toLocaleDateString("it-IT", { day: "numeric", month: "short" }),
            News: Math.floor(Math.random() * 5) + 1,
            Events: Math.floor(Math.random() * 3) + 1,
            Documents: Math.floor(Math.random() * 4) + 1,
          });
        }

        setData(trendData);
      } catch (error) {
        console.error("Failed to fetch trend data:", error);
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
      )}
    </Card>
  );
}
