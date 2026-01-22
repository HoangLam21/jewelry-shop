import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CretaeFinance } from "@/dto/FinaceDTO";
import { fetchFinance } from "@/lib/service/finance.service";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// Your imports here

const chartConfig = {
  views: {
    label: "Total",
  },
  income: {
    label: "income",
    color: "#72AEC8", // Đổi màu thành #72AEC8
  },
  outcome: {
    label: "outcome",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Chart() {
  const [financeData, setFinanceData] = React.useState<CretaeFinance[]>([]);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("income");

  // Fetch data when component mounts
  React.useEffect(() => {
    let isMounted = true;
    const loadImport = async () => {
      try {
        const data = await fetchFinance();
        if (isMounted) {
          setFinanceData(data as CretaeFinance[]);
        }
      } catch (error) {
        console.error("Error loading Provider:", error);
      }
    };
    loadImport();
    return () => {
      isMounted = false;
    };
  }, []);

  // if (!financeData) {
  //   return (
  //     <div className="flex h-screen w-screen items-center justify-center bg-white">
  //       <div className="loader"></div>
  //     </div>
  //   );
  // }

  const groupByDate = (data: CretaeFinance[]) => {
    const result = data.reduce(
      (acc, item) => {
        const date = new Date(item.date).toISOString().split("T")[0]; // Extract date (yyyy-mm-dd)
        if (!acc[date]) {
          acc[date] = { date, income: 0, outcome: 0 };
        }
        if (item.type === "income") {
          acc[date].income += item.value;
        } else if (item.type === "outcome") {
          acc[date].outcome += item.value;
        }
        return acc;
      },
      {} as Record<string, { date: string; income: number; outcome: number }>
    );

    return Object.values(result);
  };

  const formattedData = groupByDate(financeData);

  const total = React.useMemo(
    () => ({
      income: formattedData.reduce((acc, curr) => acc + curr.income, 0),
      outcome: formattedData.reduce((acc, curr) => acc + curr.outcome, 0),
    }),
    [formattedData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Revenue</CardTitle>
          <CardDescription>
            Showing total finance for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["income", "outcome"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-sm text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString("vi-VN")} VND
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value:any) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
