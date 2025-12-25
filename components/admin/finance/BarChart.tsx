"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface Props {
  id: string;
  name: string;
  quantity: number;
  color: string;
}

export function TotalCostGoods({ total }: { total: Props[] }) {
  const convertToChartDataAndConfig = (salesData: Props[]) => {
    const chartData = salesData.map((product) => ({
      browser: product.name,
      visitors: product.quantity,
      fill: product.color
    }));

    const chartConfig = salesData.reduce((config, product) => {
      config[product.name.toLowerCase()] = {
        label: product.name,
        color: product.color
      };
      return config;
    }, {} as Record<string, { label: string; color: string }>);

    // Thêm cấu hình tổng quát cho chartConfig với màu mặc định
    chartConfig.visitors = {
      label: "Quantity",
      color: "hsl(var(--default-color))" // Đặt màu mặc định
    };

    return { chartData, chartConfig };
  };

  const { chartData, chartConfig } = convertToChartDataAndConfig(total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart layout="vertical" data={chartData} margin={{ left: 0 }}>
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value.toLowerCase()]?.label}
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
