
import React from "react";
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
import { useQuery } from "@tanstack/react-query";

export default function SalesChart() {
  const { t } = useLanguage();

  // Fetch all orders
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Process orders to get monthly data
  const monthlyData = React.useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Get the last 6 months
    const last6Months = Array(6).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: months[date.getMonth()],
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        sales: 0,
        orders: 0
      };
    });

    // Process each order
    orders.forEach((order: any) => {
      const orderDate = new Date(order.orderDate);
      const monthIndex = orderDate.getMonth();
      const year = orderDate.getFullYear();
      
      // Find matching month in our data
      const monthData = last6Months.find(m => 
        m.monthIndex === monthIndex && m.year === year
      );
      
      if (monthData) {
        monthData.sales += order.totalAmount;
        monthData.orders += 1;
      }
    });

    return last6Months;
  }, [orders]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
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
            domain={[0, 'dataMax + 5']}
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
