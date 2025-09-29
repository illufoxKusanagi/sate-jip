// src/components/chart/pie-chart-new.tsx
"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { generateDistinctColors, createSafeKey } from "@/lib/utils/chart-utils";

interface ChartData {
  browser: string; // Keep using browser for compatibility
  visitors: number;
  fill: string;
}

interface ChartPie {
  dataKey: string;
  title?: string;
  description?: string;
  footerText?: string;
  apiEndpoint?: string;
  className?: string;
}

export function ChartPie({
  dataKey,
  title,
  description,
  footerText,
  apiEndpoint = "/api/statistics/locations",
  className = "",
}: ChartPie) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const autoTitle =
    title ||
    dataKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/distribution/gi, "Distribusi");

  const autoDescription =
    description || `Distribusi dari ${autoTitle.toLowerCase()}`;
  const autoFooterText =
    footerText || `Menampilkan data ${autoTitle.toLowerCase()}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch data`);
        }

        const data = await response.json();
        const rawData = data[dataKey];

        if (!rawData || !Array.isArray(rawData)) {
          throw new Error(`No data found for: ${dataKey}`);
        }

        if (rawData.length === 0) {
          setChartData([]);
          setTotalCount(0);
          return;
        }

        const firstItem = rawData[0];
        const nameField = findNameField(firstItem);
        const valueField = findValueField(firstItem);

        if (!nameField || !valueField) {
          throw new Error(`Could not detect fields in data`);
        }

        const colors = generateDistinctColors(rawData.length);

        // KEY FIX: Transform data to use safe keys as browser values
        const transformedData: ChartData[] = rawData.map(
          (item: any, index: number) => {
            const originalName = String(item[nameField]) || `Item ${index + 1}`;
            const safeKey = createSafeKey(originalName, index);

            return {
              browser: safeKey, // Use safe key for matching
              visitors: Number(item[valueField]) || 0,
              fill: colors[index],
            };
          }
        );

        const total = transformedData.reduce(
          (sum, item) => sum + item.visitors,
          0
        );

        setChartData(transformedData);
        setTotalCount(total);

        // Store original names for display
        setOriginalNames(
          rawData.map((item: any, index: number) => ({
            safeKey: createSafeKey(
              String(item[nameField]) || `Item ${index + 1}`,
              index
            ),
            originalName: String(item[nameField]) || `Item ${index + 1}`,
          }))
        );
      } catch (error) {
        console.error(`Error fetching ${dataKey}:`, error);
        setError(
          error instanceof Error ? error.message : "Failed to load data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, dataKey]);

  const [originalNames, setOriginalNames] = useState<
    Array<{ safeKey: string; originalName: string }>
  >([]);

  const findNameField = (item: any): string | null => {
    const nameFields = [
      "name",
      "label",
      "title",
      "ispName",
      "internetInfra",
      "internetSpeed",
    ];

    for (const field of nameFields) {
      if (field in item && typeof item[field] === "string") {
        return field;
      }
    }

    for (const [key, value] of Object.entries(item)) {
      if (typeof value === "string" && key !== "id") {
        return key;
      }
    }

    return null;
  };

  const findValueField = (item: any): string | null => {
    const valueFields = ["count", "value", "total", "amount"];

    for (const field of valueFields) {
      if (field in item && typeof item[field] === "number") {
        return field;
      }
    }

    for (const [key, value] of Object.entries(item)) {
      if (typeof value === "number" && key !== "id") {
        return key;
      }
    }

    return null;
  };

  // Generate chart config that matches the data keys exactly
  const chartConfig: ChartConfig = {
    visitors: { label: "Count" },
  };

  // Add config for each data item using the same safe keys
  originalNames.forEach((item, index) => {
    chartConfig[item.safeKey] = {
      label: item.originalName, // Display original name
      color: chartData[index]?.fill || `hsl(var(--chart-${(index % 5) + 1}))`,
    };
  });

  if (isLoading) {
    return (
      <Card className={`flex flex-col ${className}`}>
        <CardContent className="flex items-center justify-center p-8">
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`flex flex-col ${className}`}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className={`flex flex-col ${className}`}>
        <CardContent className="flex items-center justify-center p-8">
          <div>No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{autoTitle}</CardTitle>
        <CardDescription>{autoDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser" // This matches the safe key
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />} // This will now find matching keys
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Dari total {totalCount} item
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {autoFooterText}
        </div>
      </CardFooter>
    </Card>
  );
}
