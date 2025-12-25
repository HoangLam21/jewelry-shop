"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

// Hàm nhận tham số `total` từ đầu vào
export function TopImportedProduct({ total }: { total: any[] }) {
  // Chuyển dữ liệu `total` thành định dạng phù hợp cho biểu đồ
  const chartData = total.map((product) => ({
    name: product.name,
    quantity: product.quantity,
    fill: product.color
  }));

  const chartConfig = {
    visitors: {
      label: "Quantity"
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))"
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))"
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))"
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))"
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))"
    }
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Imported Products</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="quantity"
              nameKey="name"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
