import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useLanguage } from "@/hooks/use-language";

export default function SalesChart() {
  const { t } = useLanguage();

  // This is sample data to represent sales over time
  // In a real app, this would come from an API call
  const sampleData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Get the last 6 months
    const currentMonth = new Date().getMonth();
    const last6Months = Array(6).fill(0).map((_, i) => {
      const monthIndex = (currentMonth - 5 + i) % 12;
      return months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
    });
    
    return last6Months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 10000) + 2000,
      orders: Math.floor(Math.random() * 100) + 20
    }));
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sampleData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            yAxisId="left" 
            tickFormatter={formatCurrency} 
            orientation="left" 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, 'dataMax + 20']}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === "sales") {
                return [formatCurrency(value as number), t("admin.chart.sales")];
              }
              return [value, t("admin.chart.orders")];
            }}
          />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            name={t("admin.chart.sales")}
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.3}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name={t("admin.chart.orders")}
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
