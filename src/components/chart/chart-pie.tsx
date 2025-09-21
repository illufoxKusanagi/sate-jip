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

  // Store original names for display
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

// export { ChartPie as  };

// // src/components/chart/pie-chart-new.tsx
// "use client";

// import { Pie, PieChart } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "../ui/chart";
// import { TrendingUp } from "lucide-react";
// import { useEffect, useState } from "react";
// import { generateDistinctColors, createSafeKey } from "@/lib/utils/chart-utils";

// interface ChartData {
//   browser: string;
//   visitors: number;
//   fill: string;
// }

// interface ChartPie {
//   dataKey: string;
//   title?: string;
//   description?: string;
//   footerText?: string;
//   apiEndpoint?: string;
//   className?: string;
// }

// export function ChartPie({
//   dataKey,
//   title,
//   description,
//   footerText,
//   apiEndpoint = "/api/statistics/locations",
//   className = "",
// }: ChartPie) {
//   const [chartData, setChartData] = useState<ChartData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [totalCount, setTotalCount] = useState(0);
//   const [error, setError] = useState<string | null>(null);

//   const autoTitle =
//     title ||
//     dataKey
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase())
//       .replace(/distribution/gi, "Distribution");

//   const autoDescription =
//     description || `Distribution of ${autoTitle.toLowerCase()}`;
//   const autoFooterText =
//     footerText || `Showing ${autoTitle.toLowerCase()} data`;

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(apiEndpoint);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch data`);
//         }

//         const data = await response.json();
//         const rawData = data[dataKey];

//         if (!rawData || !Array.isArray(rawData)) {
//           throw new Error(`No data found for: ${dataKey}`);
//         }

//         if (rawData.length === 0) {
//           setChartData([]);
//           setTotalCount(0);
//           return;
//         }

//         const firstItem = rawData[0];
//         const nameField = findNameField(firstItem);
//         const valueField = findValueField(firstItem);

//         if (!nameField || !valueField) {
//           throw new Error(`Could not detect fields in data`);
//         }

//         const colors = generateDistinctColors(rawData.length);

//         const transformedData: ChartData[] = rawData.map(
//           (item: any, index: number) => ({
//             browser: String(item[nameField]) || `Item ${index + 1}`,
//             visitors: Number(item[valueField]) || 0,
//             fill: colors[index],
//           })
//         );

//         const total = transformedData.reduce(
//           (sum, item) => sum + item.visitors,
//           0
//         );

//         setChartData(transformedData);
//         setTotalCount(total);
//       } catch (error) {
//         console.error(`Error fetching ${dataKey}:`, error);
//         setError(
//           error instanceof Error ? error.message : "Failed to load data"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [apiEndpoint, dataKey]);

//   const findNameField = (item: any): string | null => {
//     const nameFields = [
//       "name",
//       "label",
//       "title",
//       "ispName",
//       "internetInfra",
//       "internetSpeed",
//     ];

//     for (const field of nameFields) {
//       if (field in item && typeof item[field] === "string") {
//         return field;
//       }
//     }

//     for (const [key, value] of Object.entries(item)) {
//       if (typeof value === "string" && key !== "id") {
//         return key;
//       }
//     }

//     return null;
//   };

//   const findValueField = (item: any): string | null => {
//     const valueFields = ["count", "value", "total", "amount"];

//     for (const field of valueFields) {
//       if (field in item && typeof item[field] === "number") {
//         return field;
//       }
//     }

//     for (const [key, value] of Object.entries(item)) {
//       if (typeof value === "number" && key !== "id") {
//         return key;
//       }
//     }

//     return null;
//   };

//   // Generate chart config using the EXACT same pattern as working examples
//   const chartConfig: ChartConfig = {
//     visitors: { label: "Count" },
//   };

//   // Add each item to config - THIS IS THE KEY PART
//   chartData.forEach((item, index) => {
//     const key = createSafeKey(item.browser, index);
//     chartConfig[key] = {
//       label: item.browser,
//       color: item.fill,
//     };
//   });

//   if (isLoading) {
//     return (
//       <Card className={`flex flex-col ${className}`}>
//         <CardContent className="flex items-center justify-center p-8">
//           <div>Loading...</div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className={`flex flex-col ${className}`}>
//         <CardContent className="flex items-center justify-center p-8">
//           <div className="text-red-500">{error}</div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (chartData.length === 0) {
//     return (
//       <Card className={`flex flex-col ${className}`}>
//         <CardContent className="flex items-center justify-center p-8">
//           <div>No data available</div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className={`flex flex-col ${className}`}>
//       <CardHeader className="items-center pb-0">
//         <CardTitle>{autoTitle}</CardTitle>
//         <CardDescription>{autoDescription}</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[350px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie data={chartData} dataKey="visitors" nameKey="browser" />
//             <ChartLegend
//               content={<ChartLegendContent nameKey="browser" />}
//               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
//             />
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           Total {totalCount} items <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           {autoFooterText}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export { ChartPie as ChartPieLabelWithLegend };

// // // src/components/chart/pie-chart-new.tsx
// // "use client";

// // import { Pie, PieChart } from "recharts";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "../ui/card";
// // import {
// //   ChartConfig,
// //   ChartContainer,
// //   ChartLegend,
// //   ChartLegendContent,
// //   ChartTooltip,
// //   ChartTooltipContent,
// // } from "../ui/chart";
// // import { TrendingUp } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { generateDistinctColors } from "@/lib/utils/chart-utils";

// // interface ChartData {
// //   browser: string;
// //   visitors: number;
// //   fill: string;
// // }

// // interface ChartPie {
// //   dataKey: string;
// //   title?: string;
// //   description?: string;
// //   footerText?: string;
// //   apiEndpoint?: string;
// //   className?: string;
// // }

// // export function ChartPie({
// //   dataKey,
// //   title,
// //   description,
// //   footerText,
// //   apiEndpoint = "/api/statistics/locations",
// //   className = "",
// // }: ChartPie) {
// //   const [chartData, setChartData] = useState<ChartData[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [totalCount, setTotalCount] = useState(0);
// //   const [error, setError] = useState<string | null>(null);

// //   const autoTitle =
// //     title ||
// //     dataKey
// //       .replace(/([A-Z])/g, " $1")
// //       .replace(/^./, (str) => str.toUpperCase())
// //       .replace(/distribution/gi, "Distribution");

// //   const autoDescription =
// //     description || `Distribution of ${autoTitle.toLowerCase()}`;
// //   const autoFooterText =
// //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setIsLoading(true);
// //       setError(null);

// //       try {
// //         const response = await fetch(apiEndpoint);

// //         if (!response.ok) {
// //           throw new Error(`Failed to fetch data`);
// //         }

// //         const data = await response.json();
// //         const rawData = data[dataKey];

// //         if (!rawData || !Array.isArray(rawData)) {
// //           throw new Error(`No data found for: ${dataKey}`);
// //         }

// //         if (rawData.length === 0) {
// //           setChartData([]);
// //           setTotalCount(0);
// //           return;
// //         }

// //         const firstItem = rawData[0];
// //         const nameField = findNameField(firstItem);
// //         const valueField = findValueField(firstItem);

// //         if (!nameField || !valueField) {
// //           throw new Error(`Could not detect fields in data`);
// //         }

// //         const colors = generateDistinctColors(rawData.length);

// //         const transformedData: ChartData[] = rawData.map(
// //           (item: any, index: number) => ({
// //             browser: String(item[nameField]) || `Item ${index + 1}`,
// //             visitors: Number(item[valueField]) || 0,
// //             fill: colors[index],
// //           })
// //         );

// //         const total = transformedData.reduce(
// //           (sum, item) => sum + item.visitors,
// //           0
// //         );

// //         setChartData(transformedData);
// //         setTotalCount(total);
// //       } catch (error) {
// //         console.error(`Error fetching ${dataKey}:`, error);
// //         setError(
// //           error instanceof Error ? error.message : "Failed to load data"
// //         );
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [apiEndpoint, dataKey]);

// //   const findNameField = (item: any): string | null => {
// //     const nameFields = [
// //       "name",
// //       "label",
// //       "title",
// //       "ispName",
// //       "internetInfra",
// //       "internetSpeed",
// //     ];

// //     for (const field of nameFields) {
// //       if (field in item && typeof item[field] === "string") {
// //         return field;
// //       }
// //     }

// //     for (const [key, value] of Object.entries(item)) {
// //       if (typeof value === "string" && key !== "id") {
// //         return key;
// //       }
// //     }

// //     return null;
// //   };

// //   const findValueField = (item: any): string | null => {
// //     const valueFields = ["count", "value", "total", "amount"];

// //     for (const field of valueFields) {
// //       if (field in item && typeof item[field] === "number") {
// //         return field;
// //       }
// //     }

// //     for (const [key, value] of Object.entries(item)) {
// //       if (typeof value === "number" && key !== "id") {
// //         return key;
// //       }
// //     }

// //     return null;
// //   };

// //   // Use the EXACT format that works with shadcn legend
// //   const chartConfig: ChartConfig = {
// //     visitors: { label: "Count" },
// //   };

// //   // Add each browser as a separate config entry
// //   chartData.forEach((item, index) => {
// //     chartConfig[item.browser.toLowerCase().replace(/[^a-z0-9]/g, "")] = {
// //       label: item.browser,
// //       color: item.fill,
// //     };
// //   });

// //   if (isLoading) {
// //     return (
// //       <Card className={`flex flex-col ${className}`}>
// //         <CardContent className="flex items-center justify-center p-8">
// //           <div>Loading...</div>
// //         </CardContent>
// //       </Card>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Card className={`flex flex-col ${className}`}>
// //         <CardContent className="flex items-center justify-center p-8">
// //           <div className="text-red-500">{error}</div>
// //         </CardContent>
// //       </Card>
// //     );
// //   }

// //   if (chartData.length === 0) {
// //     return (
// //       <Card className={`flex flex-col ${className}`}>
// //         <CardContent className="flex items-center justify-center p-8">
// //           <div>No data available</div>
// //         </CardContent>
// //       </Card>
// //     );
// //   }

// //   return (
// //     <Card className={`flex flex-col ${className}`}>
// //       <CardHeader className="items-center pb-0">
// //         <CardTitle>{autoTitle}</CardTitle>
// //         <CardDescription>{autoDescription}</CardDescription>
// //       </CardHeader>
// //       <CardContent className="flex-1 pb-0">
// //         <ChartContainer
// //           config={chartConfig}
// //           className="mx-auto aspect-square max-h-[350px]"
// //         >
// //           <PieChart>
// //             <ChartTooltip
// //               cursor={false}
// //               content={<ChartTooltipContent hideLabel />}
// //             />
// //             <Pie data={chartData} dataKey="visitors" nameKey="browser" />
// //           </PieChart>
// //         </ChartContainer>
// //       </CardContent>
// //       <CardFooter className="flex-col gap-2 text-sm">
// //         <div className="flex items-center gap-2 font-medium leading-none">
// //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// //         </div>
// //         <div className="leading-none text-muted-foreground">
// //           {autoFooterText}
// //         </div>
// //       </CardFooter>
// //     </Card>
// //   );
// // }

// // export { ChartPie as ChartPieLabelWithLegend };

// // // // src/components/chart/pie-chart-new.tsx
// // // "use client";

// // // import { Pie, PieChart } from "recharts";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardFooter,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "../ui/card";
// // // import {
// // //   ChartConfig,
// // //   ChartContainer,
// // //   ChartLegend,
// // //   ChartLegendContent,
// // //   ChartTooltip,
// // //   ChartTooltipContent,
// // // } from "../ui/chart";
// // // import { TrendingUp } from "lucide-react";
// // // import { useEffect, useState } from "react";
// // // import {
// // //   generateDistinctColors,
// // //   createSafeKey,
// // //   GenericChartDataType,
// // // } from "@/lib/utils/chart-utils";

// // // interface ChartPie {
// // //   dataKey: string;
// // //   title?: string;
// // //   description?: string;
// // //   footerText?: string;
// // //   apiEndpoint?: string;
// // //   className?: string;
// // // }

// // // export function ChartPie({
// // //   dataKey,
// // //   title,
// // //   description,
// // //   footerText,
// // //   apiEndpoint = "/api/statistics/locations",
// // //   className = "",
// // // }: ChartPie) {
// // //   const [chartData, setChartData] = useState<GenericChartDataType[]>([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [totalCount, setTotalCount] = useState(0);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const autoTitle =
// // //     title ||
// // //     dataKey
// // //       .replace(/([A-Z])/g, " $1")
// // //       .replace(/^./, (str) => str.toUpperCase())
// // //       .replace(/distribution/gi, "Distribution");

// // //   const autoDescription =
// // //     description || `Distribution of ${autoTitle.toLowerCase()}`;
// // //   const autoFooterText =
// // //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       setIsLoading(true);
// // //       setError(null);

// // //       try {
// // //         const response = await fetch(apiEndpoint);

// // //         if (!response.ok) {
// // //           throw new Error(`Failed to fetch data`);
// // //         }

// // //         const data = await response.json();
// // //         const rawData = data[dataKey];

// // //         if (!rawData || !Array.isArray(rawData)) {
// // //           throw new Error(`No data found for: ${dataKey}`);
// // //         }

// // //         if (rawData.length === 0) {
// // //           setChartData([]);
// // //           setTotalCount(0);
// // //           return;
// // //         }

// // //         const firstItem = rawData[0];
// // //         const nameField = findNameField(firstItem);
// // //         const valueField = findValueField(firstItem);

// // //         if (!nameField || !valueField) {
// // //           throw new Error(`Could not detect fields in data`);
// // //         }

// // //         // Generate colors and transform data properly
// // //         const colors = generateDistinctColors(rawData.length);

// // //         const transformedData: GenericChartDataType[] = rawData.map(
// // //           (item: any, index: number) => ({
// // //             name: String(item[nameField]) || `Item ${index + 1}`,
// // //             value: Number(item[valueField]) || 0,
// // //             fill: colors[index],
// // //           })
// // //         );

// // //         const total = transformedData.reduce(
// // //           (sum, item) => sum + item.value,
// // //           0
// // //         );

// // //         setChartData(transformedData);
// // //         setTotalCount(total);

// // //         console.log(`${dataKey} transformed data:`, transformedData);
// // //       } catch (error) {
// // //         console.error(`Error fetching ${dataKey}:`, error);
// // //         setError(
// // //           error instanceof Error ? error.message : "Failed to load data"
// // //         );
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, [apiEndpoint, dataKey]);

// // //   const findNameField = (item: any): string | null => {
// // //     const nameFields = [
// // //       "name",
// // //       "label",
// // //       "title",
// // //       "ispName",
// // //       "internetInfra",
// // //       "internetSpeed",
// // //     ];

// // //     for (const field of nameFields) {
// // //       if (field in item && typeof item[field] === "string") {
// // //         return field;
// // //       }
// // //     }

// // //     for (const [key, value] of Object.entries(item)) {
// // //       if (typeof value === "string" && key !== "id") {
// // //         return key;
// // //       }
// // //     }

// // //     return null;
// // //   };

// // //   const findValueField = (item: any): string | null => {
// // //     const valueFields = ["count", "value", "total", "amount"];

// // //     for (const field of valueFields) {
// // //       if (field in item && typeof item[field] === "number") {
// // //         return field;
// // //       }
// // //     }

// // //     for (const [key, value] of Object.entries(item)) {
// // //       if (typeof value === "number" && key !== "id") {
// // //         return key;
// // //       }
// // //     }

// // //     return null;
// // //   };

// // //   // Generate chart config manually to ensure keys match
// // //   const chartConfig: ChartConfig = {
// // //     value: { label: "Count" },
// // //     // Add each data item to config with safe keys
// // //     ...chartData.reduce((config, item, index) => {
// // //       const key = createSafeKey(item.name, index);
// // //       config[key] = {
// // //         label: item.name,
// // //         color: item.fill,
// // //       };
// // //       return config;
// // //     }, {} as Record<string, any>),
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <Card className={`flex flex-col ${className}`}>
// // //         <CardContent className="flex items-center justify-center p-8">
// // //           <div>Loading {autoTitle.toLowerCase()}...</div>
// // //         </CardContent>
// // //       </Card>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <Card className={`flex flex-col ${className}`}>
// // //         <CardContent className="flex items-center justify-center p-8">
// // //           <div className="text-red-500">{error}</div>
// // //         </CardContent>
// // //       </Card>
// // //     );
// // //   }

// // //   if (chartData.length === 0) {
// // //     return (
// // //       <Card className={`flex flex-col ${className}`}>
// // //         <CardContent className="flex items-center justify-center p-8">
// // //           <div>No data available</div>
// // //         </CardContent>
// // //       </Card>
// // //     );
// // //   }

// // //   // Debug: Log the config to see what's being generated
// // //   console.log(`${dataKey} chart config:`, chartConfig);
// // //   console.log(`${dataKey} chart data:`, chartData);

// // //   return (
// // //     <Card className={`flex flex-col ${className}`}>
// // //       <CardHeader className="items-center pb-0">
// // //         <CardTitle>{autoTitle}</CardTitle>
// // //         <CardDescription>{autoDescription}</CardDescription>
// // //       </CardHeader>
// // //       <CardContent className="flex-1 pb-0">
// // //         <ChartContainer
// // //           config={chartConfig}
// // //           className="mx-auto aspect-square max-h-[350px]"
// // //         >
// // //           <PieChart>
// // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // //             <Pie data={chartData} dataKey="value" nameKey="name" label />
// // //             <ChartLegend
// // //               content={<ChartLegendContent nameKey="name" />}
// // //               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
// // //             />
// // //           </PieChart>
// // //         </ChartContainer>
// // //       </CardContent>
// // //       <CardFooter className="flex-col gap-2 text-sm">
// // //         <div className="flex items-center gap-2 leading-none font-medium">
// // //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// // //         </div>
// // //         <div className="text-muted-foreground leading-none">
// // //           {autoFooterText}
// // //         </div>
// // //       </CardFooter>
// // //     </Card>
// // //   );
// // // }

// // // export { ChartPie as ChartPieLabelWithLegend };

// // // // // src/components/chart/pie-chart-new.tsx
// // // // "use client";

// // // // import { Pie, PieChart } from "recharts";
// // // // import {
// // // //   Card,
// // // //   CardContent,
// // // //   CardDescription,
// // // //   CardFooter,
// // // //   CardHeader,
// // // //   CardTitle,
// // // // } from "../ui/card";
// // // // import {
// // // //   ChartContainer,
// // // //   ChartLegend,
// // // //   ChartLegendContent,
// // // //   ChartTooltip,
// // // //   ChartTooltipContent,
// // // // } from "../ui/chart";
// // // // import { TrendingUp } from "lucide-react";
// // // // import { useEffect, useState } from "react";
// // // // import {
// // // //   generateDistinctColors,
// // // //   createSafeKey,
// // // //   generateChartConfig,
// // // //   GenericChartDataType,
// // // // } from "@/lib/utils/chart-utils";

// // // // interface ChartPie {
// // // //   dataKey: string;
// // // //   title?: string;
// // // //   description?: string;
// // // //   footerText?: string;
// // // //   apiEndpoint?: string;
// // // //   className?: string;
// // // // }

// // // // export function ChartPie({
// // // //   dataKey,
// // // //   title,
// // // //   description,
// // // //   footerText,
// // // //   apiEndpoint = "/api/statistics/locations",
// // // //   className = "",
// // // // }: ChartPie) {
// // // //   const [chartData, setChartData] = useState<GenericChartDataType[]>([]);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [totalCount, setTotalCount] = useState(0);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   const autoTitle =
// // // //     title ||
// // // //     dataKey
// // // //       .replace(/([A-Z])/g, " $1")
// // // //       .replace(/^./, (str) => str.toUpperCase())
// // // //       .replace(/distribution/gi, "Distribution");

// // // //   const autoDescription =
// // // //     description || `Distribution of ${autoTitle.toLowerCase()}`;
// // // //   const autoFooterText =
// // // //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       setIsLoading(true);
// // // //       setError(null);

// // // //       try {
// // // //         const response = await fetch(apiEndpoint);

// // // //         if (!response.ok) {
// // // //           throw new Error(`Failed to fetch data`);
// // // //         }

// // // //         const data = await response.json();
// // // //         const rawData = data[dataKey];

// // // //         if (!rawData || !Array.isArray(rawData)) {
// // // //           throw new Error(`No data found for: ${dataKey}`);
// // // //         }

// // // //         if (rawData.length === 0) {
// // // //           setChartData([]);
// // // //           setTotalCount(0);
// // // //           return;
// // // //         }

// // // //         const firstItem = rawData[0];
// // // //         const nameField = findNameField(firstItem);
// // // //         const valueField = findValueField(firstItem);

// // // //         if (!nameField || !valueField) {
// // // //           throw new Error(`Could not detect fields in data`);
// // // //         }

// // // //         // Generate colors and transform data properly
// // // //         const colors = generateDistinctColors(rawData.length);

// // // //         const transformedData: GenericChartDataType[] = rawData.map(
// // // //           (item: any, index: number) => ({
// // // //             name: String(item[nameField]) || `Item ${index + 1}`,
// // // //             value: Number(item[valueField]) || 0,
// // // //             fill: colors[index],
// // // //           })
// // // //         );

// // // //         const total = transformedData.reduce(
// // // //           (sum, item) => sum + item.value,
// // // //           0
// // // //         );

// // // //         setChartData(transformedData);
// // // //         setTotalCount(total);

// // // //         console.log(`${dataKey} transformed data:`, transformedData);
// // // //       } catch (error) {
// // // //         console.error(`Error fetching ${dataKey}:`, error);
// // // //         setError(
// // // //           error instanceof Error ? error.message : "Failed to load data"
// // // //         );
// // // //       } finally {
// // // //         setIsLoading(false);
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, [apiEndpoint, dataKey]);

// // // //   const findNameField = (item: any): string | null => {
// // // //     const nameFields = [
// // // //       "name",
// // // //       "label",
// // // //       "title",
// // // //       "ispName",
// // // //       "internetInfra",
// // // //       "internetSpeed",
// // // //     ];

// // // //     for (const field of nameFields) {
// // // //       if (field in item && typeof item[field] === "string") {
// // // //         return field;
// // // //       }
// // // //     }

// // // //     for (const [key, value] of Object.entries(item)) {
// // // //       if (typeof value === "string" && key !== "id") {
// // // //         return key;
// // // //       }
// // // //     }

// // // //     return null;
// // // //   };

// // // //   const findValueField = (item: any): string | null => {
// // // //     const valueFields = ["count", "value", "total", "amount"];

// // // //     for (const field of valueFields) {
// // // //       if (field in item && typeof item[field] === "number") {
// // // //         return field;
// // // //       }
// // // //     }

// // // //     for (const [key, value] of Object.entries(item)) {
// // // //       if (typeof value === "number" && key !== "id") {
// // // //         return key;
// // // //       }
// // // //     }

// // // //     return null;
// // // //   };

// // // //   // Use the utility function to generate chart config properly
// // // //   const chartConfig = generateChartConfig(chartData);

// // // //   if (isLoading) {
// // // //     return (
// // // //       <Card className={`flex flex-col ${className}`}>
// // // //         <CardContent className="flex items-center justify-center p-8">
// // // //           <div>Loading {autoTitle.toLowerCase()}...</div>
// // // //         </CardContent>
// // // //       </Card>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <Card className={`flex flex-col ${className}`}>
// // // //         <CardContent className="flex items-center justify-center p-8">
// // // //           <div className="text-red-500">{error}</div>
// // // //         </CardContent>
// // // //       </Card>
// // // //     );
// // // //   }

// // // //   if (chartData.length === 0) {
// // // //     return (
// // // //       <Card className={`flex flex-col ${className}`}>
// // // //         <CardContent className="flex items-center justify-center p-8">
// // // //           <div>No data available</div>
// // // //         </CardContent>
// // // //       </Card>
// // // //     );
// // // //   }

// // // //   // Debug: Log the config to see what's being generated
// // // //   console.log(`${dataKey} chart config:`, chartConfig);

// // // //   return (
// // // //     <Card className={`flex flex-col ${className}`}>
// // // //       <CardHeader className="items-center pb-0">
// // // //         <CardTitle>{autoTitle}</CardTitle>
// // // //         <CardDescription>{autoDescription}</CardDescription>
// // // //       </CardHeader>
// // // //       <CardContent className="flex-1 pb-0">
// // // //         <ChartContainer
// // // //           config={chartConfig}
// // // //           className="mx-auto aspect-square max-h-[350px]"
// // // //         >
// // // //           <PieChart>
// // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // //             <Pie data={chartData} dataKey="value" nameKey="name" label />
// // // //             <ChartLegend
// // // //               content={<ChartLegendContent nameKey="name" />}
// // // //               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
// // // //             />
// // // //           </PieChart>
// // // //         </ChartContainer>
// // // //       </CardContent>
// // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// // // //         </div>
// // // //         <div className="text-muted-foreground leading-none">
// // // //           {autoFooterText}
// // // //         </div>
// // // //       </CardFooter>
// // // //     </Card>
// // // //   );
// // // // }

// // // // export { ChartPie as ChartPieLabelWithLegend };

// // // // // // src/components/chart/pie-chart-new.tsx
// // // // // "use client";

// // // // // import { Pie, PieChart } from "recharts";
// // // // // import {
// // // // //   Card,
// // // // //   CardContent,
// // // // //   CardDescription,
// // // // //   CardFooter,
// // // // //   CardHeader,
// // // // //   CardTitle,
// // // // // } from "../ui/card";
// // // // // import {
// // // // //   ChartContainer,
// // // // //   ChartLegend,
// // // // //   ChartLegendContent,
// // // // //   ChartTooltip,
// // // // //   ChartTooltipContent,
// // // // // } from "../ui/chart";
// // // // // import { TrendingUp } from "lucide-react";
// // // // // import { useEffect, useState } from "react";
// // // // // import {
// // // // //   generateDistinctColors,
// // // // //   generateChartConfig,
// // // // //   GenericChartDataType,
// // // // // } from "@/lib/utils/chart-utils";

// // // // // interface ChartPie {
// // // // //   dataKey: string;
// // // // //   title?: string;
// // // // //   description?: string;
// // // // //   footerText?: string;
// // // // //   apiEndpoint?: string;
// // // // //   className?: string;
// // // // // }

// // // // // export function ChartPie({
// // // // //   dataKey,
// // // // //   title,
// // // // //   description,
// // // // //   footerText,
// // // // //   apiEndpoint = "/api/statistics/locations",
// // // // //   className = "",
// // // // // }: ChartPie) {
// // // // //   const [chartData, setChartData] = useState<GenericChartDataType[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [totalCount, setTotalCount] = useState(0);
// // // // //   const [error, setError] = useState<string | null>(null);

// // // // //   const autoTitle =
// // // // //     title ||
// // // // //     dataKey
// // // // //       .replace(/([A-Z])/g, " $1")
// // // // //       .replace(/^./, (str) => str.toUpperCase())
// // // // //       .replace(/distribution/gi, "Distribution");

// // // // //   const autoDescription =
// // // // //     description || `Distribution of ${autoTitle.toLowerCase()}`;
// // // // //   const autoFooterText =
// // // // //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// // // // //   useEffect(() => {
// // // // //     const fetchData = async () => {
// // // // //       setIsLoading(true);
// // // // //       setError(null);

// // // // //       try {
// // // // //         const response = await fetch(apiEndpoint);

// // // // //         if (!response.ok) {
// // // // //           throw new Error(`Failed to fetch data`);
// // // // //         }

// // // // //         const data = await response.json();
// // // // //         const rawData = data[dataKey];

// // // // //         if (!rawData || !Array.isArray(rawData)) {
// // // // //           throw new Error(`No data found for: ${dataKey}`);
// // // // //         }

// // // // //         if (rawData.length === 0) {
// // // // //           setChartData([]);
// // // // //           setTotalCount(0);
// // // // //           return;
// // // // //         }

// // // // //         const firstItem = rawData[0];
// // // // //         const nameField = findNameField(firstItem);
// // // // //         const valueField = findValueField(firstItem);

// // // // //         if (!nameField || !valueField) {
// // // // //           throw new Error(`Could not detect fields in data`);
// // // // //         }

// // // // //         const colors = generateDistinctColors(rawData.length);

// // // // //         const transformedData: GenericChartDataType[] = rawData.map(
// // // // //           (item: any, index: number) => ({
// // // // //             name: String(item[nameField]) || `Item ${index + 1}`,
// // // // //             value: Number(item[valueField]) || 0,
// // // // //             fill: colors[index],
// // // // //           })
// // // // //         );

// // // // //         const total = transformedData.reduce(
// // // // //           (sum, item) => sum + item.value,
// // // // //           0
// // // // //         );

// // // // //         setChartData(transformedData);
// // // // //         setTotalCount(total);
// // // // //       } catch (error) {
// // // // //         console.error(`Error fetching ${dataKey}:`, error);
// // // // //         setError(
// // // // //           error instanceof Error ? error.message : "Failed to load data"
// // // // //         );
// // // // //       } finally {
// // // // //         setIsLoading(false);
// // // // //       }
// // // // //     };

// // // // //     fetchData();
// // // // //   }, [apiEndpoint, dataKey]);

// // // // //   const findNameField = (item: any): string | null => {
// // // // //     const nameFields = [
// // // // //       "name",
// // // // //       "label",
// // // // //       "title",
// // // // //       "ispName",
// // // // //       "internetInfra",
// // // // //       "internetSpeed",
// // // // //     ];

// // // // //     for (const field of nameFields) {
// // // // //       if (field in item && typeof item[field] === "string") {
// // // // //         return field;
// // // // //       }
// // // // //     }

// // // // //     for (const [key, value] of Object.entries(item)) {
// // // // //       if (typeof value === "string" && key !== "id") {
// // // // //         return key;
// // // // //       }
// // // // //     }

// // // // //     return null;
// // // // //   };

// // // // //   const findValueField = (item: any): string | null => {
// // // // //     const valueFields = ["count", "value", "total", "amount"];

// // // // //     for (const field of valueFields) {
// // // // //       if (field in item && typeof item[field] === "number") {
// // // // //         return field;
// // // // //       }
// // // // //     }

// // // // //     for (const [key, value] of Object.entries(item)) {
// // // // //       if (typeof value === "number" && key !== "id") {
// // // // //         return key;
// // // // //       }
// // // // //     }

// // // // //     return null;
// // // // //   };

// // // // //   const chartConfig = generateChartConfig(chartData);

// // // // //   if (isLoading) {
// // // // //     return (
// // // // //       <Card className={`flex flex-col ${className}`}>
// // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // //           <div>Loading {autoTitle.toLowerCase()}...</div>
// // // // //         </CardContent>
// // // // //       </Card>
// // // // //     );
// // // // //   }

// // // // //   if (error) {
// // // // //     return (
// // // // //       <Card className={`flex flex-col ${className}`}>
// // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // //           <div className="text-red-500">{error}</div>
// // // // //         </CardContent>
// // // // //       </Card>
// // // // //     );
// // // // //   }

// // // // //   if (chartData.length === 0) {
// // // // //     return (
// // // // //       <Card className={`flex flex-col ${className}`}>
// // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // //           <div>No data available</div>
// // // // //         </CardContent>
// // // // //       </Card>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <Card className={`flex flex-col ${className}`}>
// // // // //       <CardHeader className="items-center pb-0">
// // // // //         <CardTitle>{autoTitle}</CardTitle>
// // // // //         <CardDescription>{autoDescription}</CardDescription>
// // // // //       </CardHeader>
// // // // //       <CardContent className="flex-1 pb-0">
// // // // //         <ChartContainer
// // // // //           config={chartConfig}
// // // // //           className="mx-auto aspect-square max-h-[350px]"
// // // // //         >
// // // // //           <PieChart>
// // // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // //             <Pie data={chartData} dataKey="value" nameKey="name" label />
// // // // //             <ChartLegend
// // // // //               content={<ChartLegendContent nameKey="name" />}
// // // // //               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
// // // // //             />
// // // // //           </PieChart>
// // // // //         </ChartContainer>
// // // // //       </CardContent>
// // // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // // //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// // // // //         </div>
// // // // //         <div className="text-muted-foreground leading-none">
// // // // //           {autoFooterText}
// // // // //         </div>
// // // // //       </CardFooter>
// // // // //     </Card>
// // // // //   );
// // // // // }

// // // // // export { ChartPie as ChartPieLabelWithLegend };

// // // // // // // src/components/chart/pie-chart-new.tsx
// // // // // // "use client";

// // // // // // import { Pie, PieChart } from "recharts";
// // // // // // import {
// // // // // //   Card,
// // // // // //   CardContent,
// // // // // //   CardDescription,
// // // // // //   CardFooter,
// // // // // //   CardHeader,
// // // // // //   CardTitle,
// // // // // // } from "../ui/card";
// // // // // // import {
// // // // // //   ChartContainer,
// // // // // //   ChartLegend,
// // // // // //   ChartLegendContent,
// // // // // //   ChartTooltip,
// // // // // //   ChartTooltipContent,
// // // // // // } from "../ui/chart";
// // // // // // import { TrendingUp } from "lucide-react";
// // // // // // import { useEffect, useState } from "react";
// // // // // // import {
// // // // // //   generateDistinctColors,
// // // // // //   createSafeKey,
// // // // // //   generateChartConfig,
// // // // // //   GenericChartDataType,
// // // // // // } from "@/lib/utils/chart-utils";

// // // // // // interface ChartPie {
// // // // // //   dataKey: string;
// // // // // //   title?: string;
// // // // // //   description?: string;
// // // // // //   footerText?: string;
// // // // // //   apiEndpoint?: string;
// // // // // //   className?: string;
// // // // // // }

// // // // // // export function ChartPie({
// // // // // //   dataKey,
// // // // // //   title,
// // // // // //   description,
// // // // // //   footerText,
// // // // // //   apiEndpoint = "/api/statistics/locations",
// // // // // //   className = "",
// // // // // // }: ChartPie) {
// // // // // //   const [chartData, setChartData] = useState<GenericChartDataType[]>([]);
// // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // //   const [totalCount, setTotalCount] = useState(0);
// // // // // //   const [error, setError] = useState<string | null>(null);

// // // // // //   // Auto-generate title if not provided
// // // // // //   const autoTitle =
// // // // // //     title ||
// // // // // //     dataKey
// // // // // //       .replace(/([A-Z])/g, " $1")
// // // // // //       .replace(/^./, (str) => str.toUpperCase())
// // // // // //       .replace(/distribution/gi, "Distribution");

// // // // // //   const autoDescription =
// // // // // //     description || `Distribution of ${autoTitle.toLowerCase()}`;
// // // // // //   const autoFooterText =
// // // // // //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// // // // // //   useEffect(() => {
// // // // // //     const fetchData = async () => {
// // // // // //       setIsLoading(true);
// // // // // //       setError(null);

// // // // // //       try {
// // // // // //         const response = await fetch(apiEndpoint);

// // // // // //         if (!response.ok) {
// // // // // //           throw new Error(`Failed to fetch data`);
// // // // // //         }

// // // // // //         const data = await response.json();
// // // // // //         const rawData = data[dataKey];

// // // // // //         if (!rawData || !Array.isArray(rawData)) {
// // // // // //           throw new Error(`No data found for: ${dataKey}`);
// // // // // //         }

// // // // // //         if (rawData.length === 0) {
// // // // // //           setChartData([]);
// // // // // //           setTotalCount(0);
// // // // // //           return;
// // // // // //         }

// // // // // //         // Auto-detect fields
// // // // // //         const firstItem = rawData[0];
// // // // // //         const nameField = findNameField(firstItem);
// // // // // //         const valueField = findValueField(firstItem);

// // // // // //         if (!nameField || !valueField) {
// // // // // //           throw new Error(`Could not detect fields in data`);
// // // // // //         }

// // // // // //         // Generate colors using chart utils
// // // // // //         const colors = generateDistinctColors(rawData.length);

// // // // // //         // Transform data using proper interface
// // // // // //         const transformedData: GenericChartDataType[] = rawData.map(
// // // // // //           (item: any, index: number) => ({
// // // // // //             name: String(item[nameField]) || `Item ${index + 1}`,
// // // // // //             value: Number(item[valueField]) || 0,
// // // // // //             fill: colors[index], // Use generated colors
// // // // // //           })
// // // // // //         );

// // // // // //         const total = transformedData.reduce(
// // // // // //           (sum, item) => sum + item.value,
// // // // // //           0
// // // // // //         );

// // // // // //         setChartData(transformedData);
// // // // // //         setTotalCount(total);

// // // // // //         console.log(`${dataKey} data:`, transformedData);
// // // // // //       } catch (error) {
// // // // // //         console.error(`Error fetching ${dataKey}:`, error);
// // // // // //         setError(
// // // // // //           error instanceof Error ? error.message : "Failed to load data"
// // // // // //         );
// // // // // //       } finally {
// // // // // //         setIsLoading(false);
// // // // // //       }
// // // // // //     };

// // // // // //     fetchData();
// // // // // //   }, [apiEndpoint, dataKey]);

// // // // // //   // Find name field (for labels)
// // // // // //   const findNameField = (item: any): string | null => {
// // // // // //     const nameFields = [
// // // // // //       "name",
// // // // // //       "label",
// // // // // //       "title",
// // // // // //       "ispName",
// // // // // //       "internetInfra",
// // // // // //       "internetSpeed",
// // // // // //       "opdType",
// // // // // //       "jipStatus",
// // // // // //     ];

// // // // // //     for (const field of nameFields) {
// // // // // //       if (field in item && typeof item[field] === "string") {
// // // // // //         return field;
// // // // // //       }
// // // // // //     }

// // // // // //     // Find first string field
// // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // //       if (typeof value === "string" && key !== "id") {
// // // // // //         return key;
// // // // // //       }
// // // // // //     }

// // // // // //     return null;
// // // // // //   };

// // // // // //   // Find value field (for numbers)
// // // // // //   const findValueField = (item: any): string | null => {
// // // // // //     const valueFields = ["count", "value", "total", "amount"];

// // // // // //     for (const field of valueFields) {
// // // // // //       if (field in item && typeof item[field] === "number") {
// // // // // //         return field;
// // // // // //       }
// // // // // //     }

// // // // // //     // Find first number field
// // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // //       if (typeof value === "number" && key !== "id") {
// // // // // //         return key;
// // // // // //       }
// // // // // //     }

// // // // // //     return null;
// // // // // //   };

// // // // // //   // Generate chart config using the utility function
// // // // // //   const chartConfig = generateChartConfig(chartData);

// // // // // //   if (isLoading) {
// // // // // //     return (
// // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // //           <div>Loading {autoTitle.toLowerCase()}...</div>
// // // // // //         </CardContent>
// // // // // //       </Card>
// // // // // //     );
// // // // // //   }

// // // // // //   if (error) {
// // // // // //     return (
// // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // //           <div className="text-red-500">{error}</div>
// // // // // //         </CardContent>
// // // // // //       </Card>
// // // // // //     );
// // // // // //   }

// // // // // //   if (chartData.length === 0) {
// // // // // //     return (
// // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // //           <div>No data available</div>
// // // // // //         </CardContent>
// // // // // //       </Card>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <Card className={`flex flex-col ${className}`}>
// // // // // //       <CardHeader className="items-center pb-0">
// // // // // //         <CardTitle>{autoTitle}</CardTitle>
// // // // // //         <CardDescription>{autoDescription}</CardDescription>
// // // // // //       </CardHeader>
// // // // // //       <CardContent className="flex-1 pb-0">
// // // // // //         <ChartContainer
// // // // // //           config={chartConfig}
// // // // // //           className="mx-auto aspect-square max-h-[350px]"
// // // // // //         >
// // // // // //           <PieChart>
// // // // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // // //             <Pie data={chartData} dataKey="value" nameKey="name" label />
// // // // // //             <ChartLegend
// // // // // //               content={<ChartLegendContent nameKey="name" />}
// // // // // //               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
// // // // // //             />
// // // // // //           </PieChart>
// // // // // //         </ChartContainer>
// // // // // //       </CardContent>
// // // // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // // // //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// // // // // //         </div>
// // // // // //         <div className="text-muted-foreground leading-none">
// // // // // //           {autoFooterText}
// // // // // //         </div>
// // // // // //       </CardFooter>
// // // // // //     </Card>
// // // // // //   );
// // // // // // }

// // // // // // // Export with backward compatibility
// // // // // // export { ChartPie as ChartPieLabelWithLegend };

// // // // // // // // src/components/chart/dynamic-pie-chart.tsx
// // // // // // // "use client";

// // // // // // // import { Pie, PieChart } from "recharts";
// // // // // // // import {
// // // // // // //   Card,
// // // // // // //   CardContent,
// // // // // // //   CardDescription,
// // // // // // //   CardFooter,
// // // // // // //   CardHeader,
// // // // // // //   CardTitle,
// // // // // // // } from "../ui/card";
// // // // // // // import {
// // // // // // //   ChartConfig,
// // // // // // //   ChartContainer,
// // // // // // //   ChartLegend,
// // // // // // //   ChartLegendContent,
// // // // // // //   ChartTooltip,
// // // // // // //   ChartTooltipContent,
// // // // // // // } from "../ui/chart";
// // // // // // // import { TrendingUp } from "lucide-react";
// // // // // // // import { useEffect, useState } from "react";
// // // // // // // import { generateDistinctColors, createSafeKey } from "@/lib/utils/chart-utils";

// // // // // // // interface GenericChartData {
// // // // // // //   name: string;
// // // // // // //   value: number;
// // // // // // //   fill: string;
// // // // // // // }

// // // // // // // interface ChartPie {
// // // // // // //   dataKey: string; // Just the key from API response
// // // // // // //   title?: string; // Optional, will auto-generate if not provided
// // // // // // //   description?: string;
// // // // // // //   footerText?: string;
// // // // // // //   apiEndpoint?: string;
// // // // // // //   className?: string;
// // // // // // //   // Auto-detection fields (optional)
// // // // // // //   nameField?: string; // If not provided, will try to detect
// // // // // // //   valueField?: string; // If not provided, will try to detect
// // // // // // // }

// // // // // // // export function ChartPie({
// // // // // // //   dataKey,
// // // // // // //   title,
// // // // // // //   description,
// // // // // // //   footerText,
// // // // // // //   apiEndpoint = "/api/statistics/locations",
// // // // // // //   className = "",
// // // // // // //   nameField,
// // // // // // //   valueField,
// // // // // // // }: ChartPie) {
// // // // // // //   const [chartData, setChartData] = useState<GenericChartData[]>([]);
// // // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // // //   const [totalCount, setTotalCount] = useState(0);
// // // // // // //   const [error, setError] = useState<string | null>(null);

// // // // // // //   // Auto-generate title from dataKey if not provided
// // // // // // //   const autoTitle =
// // // // // // //     title ||
// // // // // // //     dataKey
// // // // // // //       .replace(/([A-Z])/g, " $1") // Add space before capital letters
// // // // // // //       .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
// // // // // // //       .replace(/distribution/gi, "Distribution"); // Proper case for 'Distribution'

// // // // // // //   const autoDescription =
// // // // // // //     description || `Data distribution for ${autoTitle.toLowerCase()}`;
// // // // // // //   const autoFooterText =
// // // // // // //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchData = async () => {
// // // // // // //       setIsLoading(true);
// // // // // // //       setError(null);

// // // // // // //       try {
// // // // // // //         const response = await fetch(apiEndpoint);

// // // // // // //         if (!response.ok) {
// // // // // // //           throw new Error(`HTTP error! status: ${response.status}`);
// // // // // // //         }

// // // // // // //         const data = await response.json();
// // // // // // //         const rawData = data[dataKey];

// // // // // // //         if (!rawData || !Array.isArray(rawData)) {
// // // // // // //           throw new Error(`No data found for key: ${dataKey}`);
// // // // // // //         }

// // // // // // //         if (rawData.length === 0) {
// // // // // // //           setChartData([]);
// // // // // // //           setTotalCount(0);
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         // Auto-detect field names if not provided
// // // // // // //         const firstItem = rawData[0];
// // // // // // //         const detectedNameField = nameField || detectNameField(firstItem);
// // // // // // //         const detectedValueField = valueField || detectValueField(firstItem);

// // // // // // //         if (!detectedNameField || !detectedValueField) {
// // // // // // //           throw new Error(
// // // // // // //             `Could not detect name or value fields in data. Available fields: ${Object.keys(
// // // // // // //               firstItem
// // // // // // //             ).join(", ")}`
// // // // // // //           );
// // // // // // //         }

// // // // // // //         // Transform data
// // // // // // //         const colors = generateDistinctColors(rawData.length);
// // // // // // //         const transformedData = rawData.map((item: any, index: number) => ({
// // // // // // //           name: item[detectedNameField] || `Item ${index + 1}`,
// // // // // // //           value: item[detectedValueField] || 0,
// // // // // // //           fill: colors[index],
// // // // // // //         }));

// // // // // // //         const total = rawData.reduce(
// // // // // // //           (sum: number, item: any) => sum + (item[detectedValueField] || 0),
// // // // // // //           0
// // // // // // //         );

// // // // // // //         setChartData(transformedData);
// // // // // // //         setTotalCount(total);
// // // // // // //         console.log(data);
// // // // // // //       } catch (error) {
// // // // // // //         console.error(`Error fetching data for ${dataKey}:`, error);
// // // // // // //         setError(error instanceof Error ? error.message : "Unknown error");
// // // // // // //       } finally {
// // // // // // //         setIsLoading(false);
// // // // // // //       }
// // // // // // //     };
// // // // // // //     fetchData();
// // // // // // //   }, [apiEndpoint, dataKey, nameField, valueField]);

// // // // // // //   // Auto-detect name field (common patterns)
// // // // // // //   const detectNameField = (item: any): string | null => {
// // // // // // //     const commonNameFields = [
// // // // // // //       "name",
// // // // // // //       "label",
// // // // // // //       "title",
// // // // // // //       "ispName",
// // // // // // //       "internetInfra",
// // // // // // //       "internetSpeed",
// // // // // // //       "opdType",
// // // // // // //       "jipStatus",
// // // // // // //       "category",
// // // // // // //       "type",
// // // // // // //       "group",
// // // // // // //     ];

// // // // // // //     for (const field of commonNameFields) {
// // // // // // //       if (item.hasOwnProperty(field)) {
// // // // // // //         return field;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     // Fallback: find first string field
// // // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // // //       if (typeof value === "string") {
// // // // // // //         return key;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     return null;
// // // // // // //   };

// // // // // // //   // Auto-detect value field (common patterns)
// // // // // // //   const detectValueField = (item: any): string | null => {
// // // // // // //     const commonValueFields = ["count", "value", "total", "amount", "quantity"];

// // // // // // //     for (const field of commonValueFields) {
// // // // // // //       if (item.hasOwnProperty(field)) {
// // // // // // //         return field;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     // Fallback: find first number field
// // // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // // //       if (typeof value === "number") {
// // // // // // //         return key;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     return null;
// // // // // // //   };

// // // // // // //   // Generate dynamic chart config
// // // // // // //   const chartConfig = chartData.reduce(
// // // // // // //     (config: any, item: any, index: number) => {
// // // // // // //       const key = createSafeKey(item.name, index);

// // // // // // //       config[key] = {
// // // // // // //         label: item.name,
// // // // // // //         color: `hsl(var(--chart-${(index % 5) + 1}))`,
// // // // // // //       };
// // // // // // //       return config;
// // // // // // //     },
// // // // // // //     {
// // // // // // //       value: { label: "Value" },
// // // // // // //     }
// // // // // // //   ) satisfies ChartConfig;

// // // // // // //   if (isLoading) {
// // // // // // //     return (
// // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // //           <div>Loading {autoTitle.toLowerCase()}...</div>
// // // // // // //         </CardContent>
// // // // // // //       </Card>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (error) {
// // // // // // //     return (
// // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // //           <div className="text-red-500">Error: {error}</div>
// // // // // // //         </CardContent>
// // // // // // //       </Card>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (chartData.length === 0) {
// // // // // // //     return (
// // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // //           <div>No data available for {autoTitle.toLowerCase()}</div>
// // // // // // //         </CardContent>
// // // // // // //       </Card>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <Card className={`flex flex-col ${className}`}>
// // // // // // //       <CardHeader className="items-center pb-0">
// // // // // // //         <CardTitle>{autoTitle}</CardTitle>
// // // // // // //         <CardDescription>{autoDescription}</CardDescription>
// // // // // // //       </CardHeader>
// // // // // // //       <CardContent className="flex-1 pb-0">
// // // // // // //         <ChartContainer
// // // // // // //           config={chartConfig}
// // // // // // //           className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
// // // // // // //         >
// // // // // // //           <PieChart>
// // // // // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // // // //             <Pie data={chartData} dataKey="value" nameKey="name" label />
// // // // // // //             <ChartLegend
// // // // // // //               content={<ChartLegendContent nameKey="name" />}
// // // // // // //               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
// // // // // // //             />
// // // // // // //           </PieChart>
// // // // // // //         </ChartContainer>
// // // // // // //       </CardContent>
// // // // // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // // // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // // // // //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// // // // // // //         </div>
// // // // // // //         <div className="text-muted-foreground leading-none">
// // // // // // //           {autoFooterText}
// // // // // // //         </div>
// // // // // // //       </CardFooter>
// // // // // // //     </Card>
// // // // // // //   );
// // // // // // // }

// // // // // // // // // src/components/chart/pie-chart-new.tsx
// // // // // // // // "use client";

// // // // // // // // import { Pie, PieChart } from "recharts";
// // // // // // // // import {
// // // // // // // //   Card,
// // // // // // // //   CardContent,
// // // // // // // //   CardDescription,
// // // // // // // //   CardFooter,
// // // // // // // //   CardHeader,
// // // // // // // //   CardTitle,
// // // // // // // // } from "../ui/card";
// // // // // // // // import {
// // // // // // // //   ChartConfig,
// // // // // // // //   ChartContainer,
// // // // // // // //   ChartLegend,
// // // // // // // //   ChartLegendContent,
// // // // // // // //   ChartTooltip,
// // // // // // // //   ChartTooltipContent,
// // // // // // // // } from "../ui/chart";
// // // // // // // // import { TrendingUp } from "lucide-react";
// // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // import { generateDistinctColors, createSafeKey } from "@/lib/utils/chart-utils";

// // // // // // // // interface GenericChartData {
// // // // // // // //   name: string;
// // // // // // // //   value: number;
// // // // // // // //   fill: string;
// // // // // // // // }

// // // // // // // // interface ChartPie {
// // // // // // // //   dataKey: string; // Just the API response key
// // // // // // // //   title?: string;
// // // // // // // //   description?: string;
// // // // // // // //   footerText?: string;
// // // // // // // //   apiEndpoint?: string;
// // // // // // // //   className?: string;
// // // // // // // // }

// // // // // // // // export function ChartPie({
// // // // // // // //   dataKey,
// // // // // // // //   title,
// // // // // // // //   description,
// // // // // // // //   footerText,
// // // // // // // //   apiEndpoint = "/api/statistics/locations",
// // // // // // // //   className = "",
// // // // // // // // }: ChartPie) {
// // // // // // // //   const [chartData, setChartData] = useState<GenericChartData[]>([]);
// // // // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // // // //   const [totalCount, setTotalCount] = useState(0);
// // // // // // // //   const [error, setError] = useState<string | null>(null);

// // // // // // // //   // Auto-generate title from dataKey if not provided
// // // // // // // //   const autoTitle =
// // // // // // // //     title ||
// // // // // // // //     dataKey
// // // // // // // //       .replace(/([A-Z])/g, " $1")
// // // // // // // //       .replace(/^./, (str) => str.toUpperCase())
// // // // // // // //       .replace(/distribution/gi, "Distribution");

// // // // // // // //   const autoDescription =
// // // // // // // //     description || `Distribution of ${autoTitle.toLowerCase()}`;
// // // // // // // //   const autoFooterText =
// // // // // // // //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// // // // // // // //   useEffect(() => {
// // // // // // // //     const fetchData = async () => {
// // // // // // // //       setIsLoading(true);
// // // // // // // //       setError(null);

// // // // // // // //       try {
// // // // // // // //         const response = await fetch(apiEndpoint);

// // // // // // // //         if (!response.ok) {
// // // // // // // //           throw new Error(`HTTP error! status: ${response.status}`);
// // // // // // // //         }

// // // // // // // //         const data = await response.json();
// // // // // // // //         const rawData = data[dataKey];

// // // // // // // //         if (!rawData || !Array.isArray(rawData)) {
// // // // // // // //           throw new Error(`No data found for key: ${dataKey}`);
// // // // // // // //         }

// // // // // // // //         if (rawData.length === 0) {
// // // // // // // //           setChartData([]);
// // // // // // // //           setTotalCount(0);
// // // // // // // //           return;
// // // // // // // //         }

// // // // // // // //         // Auto-detect field names from the first item
// // // // // // // //         const firstItem = rawData[0];
// // // // // // // //         const nameField = detectNameField(firstItem);
// // // // // // // //         const valueField = detectValueField(firstItem);

// // // // // // // //         if (!nameField || !valueField) {
// // // // // // // //           throw new Error(
// // // // // // // //             `Could not detect name or value fields. Available fields: ${Object.keys(
// // // // // // // //               firstItem
// // // // // // // //             ).join(", ")}`
// // // // // // // //           );
// // // // // // // //         }

// // // // // // // //         console.log(`Auto-detected fields for ${dataKey}:`, {
// // // // // // // //           nameField,
// // // // // // // //           valueField,
// // // // // // // //         });

// // // // // // // //         // Transform data with auto-detected colors
// // // // // // // //         const colors = generateDistinctColors(rawData.length);
// // // // // // // //         const transformedData = rawData.map((item: any, index: number) => ({
// // // // // // // //           name: item[nameField] || `Item ${index + 1}`,
// // // // // // // //           value: item[valueField] || 0,
// // // // // // // //           fill: colors[index],
// // // // // // // //         }));

// // // // // // // //         const total = rawData.reduce(
// // // // // // // //           (sum: number, item: any) => sum + (item[valueField] || 0),
// // // // // // // //           0
// // // // // // // //         );

// // // // // // // //         setChartData(transformedData);
// // // // // // // //         setTotalCount(total);
// // // // // // // //       } catch (error) {
// // // // // // // //         console.error(`Error fetching data for ${dataKey}:`, error);
// // // // // // // //         setError(error instanceof Error ? error.message : "Unknown error");
// // // // // // // //       } finally {
// // // // // // // //         setIsLoading(false);
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     fetchData();
// // // // // // // //   }, [apiEndpoint, dataKey]);

// // // // // // // //   // Auto-detect name field (string fields)
// // // // // // // //   const detectNameField = (item: any): string | null => {
// // // // // // // //     // Look for common name patterns first
// // // // // // // //     const commonNames = [
// // // // // // // //       "name",
// // // // // // // //       "label",
// // // // // // // //       "title",
// // // // // // // //       "ispName",
// // // // // // // //       "internetInfra",
// // // // // // // //       "internetSpeed",
// // // // // // // //       "opdType",
// // // // // // // //       "jipStatus",
// // // // // // // //     ];
// // // // // // // //     for (const field of commonNames) {
// // // // // // // //       if (item.hasOwnProperty(field) && typeof item[field] === "string") {
// // // // // // // //         return field;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     // Fallback: find any string field
// // // // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // // // //       if (typeof value === "string" && key !== "id") {
// // // // // // // //         return key;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     return null;
// // // // // // // //   };

// // // // // // // //   // Auto-detect value field (number fields)
// // // // // // // //   const detectValueField = (item: any): string | null => {
// // // // // // // //     // Look for common value patterns first
// // // // // // // //     const commonValues = ["count", "value", "total", "amount", "quantity"];
// // // // // // // //     for (const field of commonValues) {
// // // // // // // //       if (item.hasOwnProperty(field) && typeof item[field] === "number") {
// // // // // // // //         return field;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     // Fallback: find any number field
// // // // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // // // //       if (typeof value === "number" && key !== "id") {
// // // // // // // //         return key;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     return null;
// // // // // // // //   };

// // // // // // // //   // Generate chart config dynamically
// // // // // // // //   const chartConfig = chartData.reduce(
// // // // // // // //     (config: any, item: any, index: number) => {
// // // // // // // //       const key = createSafeKey(item.name, index);

// // // // // // // //       config[key] = {
// // // // // // // //         label: item.name,
// // // // // // // //         color: item.fill,
// // // // // // // //       };
// // // // // // // //       return config;
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       value: { label: "Value" },
// // // // // // // //     }
// // // // // // // //   ) satisfies ChartConfig;

// // // // // // // //   if (isLoading) {
// // // // // // // //     return (
// // // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // // //           <div>Loading {autoTitle.toLowerCase()}...</div>
// // // // // // // //         </CardContent>
// // // // // // // //       </Card>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (error) {
// // // // // // // //     return (
// // // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // // //           <div className="text-red-500">Error: {error}</div>
// // // // // // // //         </CardContent>
// // // // // // // //       </Card>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (chartData.length === 0) {
// // // // // // // //     return (
// // // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // // //           <div>No data available</div>
// // // // // // // //         </CardContent>
// // // // // // // //       </Card>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <Card className={`flex flex-col ${className}`}>
// // // // // // // //       <CardHeader className="items-center pb-0">
// // // // // // // //         <CardTitle>{autoTitle}</CardTitle>
// // // // // // // //         <CardDescription>{autoDescription}</CardDescription>
// // // // // // // //       </CardHeader>
// // // // // // // //       <CardContent className="flex-1 pb-0">
// // // // // // // //         <ChartContainer
// // // // // // // //           config={chartConfig}
// // // // // // // //           className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
// // // // // // // //         >
// // // // // // // //           <PieChart>
// // // // // // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // // // // //             <Pie data={chartData} dataKey="value" nameKey="name" label />
// // // // // // // //             <ChartLegend
// // // // // // // //               content={<ChartLegendContent nameKey="name" />}
// // // // // // // //               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
// // // // // // // //             />
// // // // // // // //           </PieChart>
// // // // // // // //         </ChartContainer>
// // // // // // // //       </CardContent>
// // // // // // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // // // // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // // // // // //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// // // // // // // //         </div>
// // // // // // // //         <div className="text-muted-foreground leading-none">
// // // // // // // //           {autoFooterText}
// // // // // // // //         </div>
// // // // // // // //       </CardFooter>
// // // // // // // //     </Card>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // // Export as the main component too
// // // // // // // // export { ChartPie as ChartPieLabelWithLegend };

// // // // // // // // // // src/components/chart/dynamic-pie-chart.tsx
// // // // // // // // // "use client";

// // // // // // // // // import { Pie, PieChart } from "recharts";
// // // // // // // // // import {
// // // // // // // // //   Card,
// // // // // // // // //   CardContent,
// // // // // // // // //   CardDescription,
// // // // // // // // //   CardFooter,
// // // // // // // // //   CardHeader,
// // // // // // // // //   CardTitle,
// // // // // // // // // } from "../ui/card";
// // // // // // // // // import {
// // // // // // // // //   ChartConfig,
// // // // // // // // //   ChartContainer,
// // // // // // // // //   ChartLegend,
// // // // // // // // //   ChartLegendContent,
// // // // // // // // //   ChartTooltip,
// // // // // // // // //   ChartTooltipContent,
// // // // // // // // // } from "../ui/chart";
// // // // // // // // // import { TrendingUp } from "lucide-react";
// // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // import { generateDistinctColors, createSafeKey } from "@/lib/utils/chart-utils";

// // // // // // // // // interface GenericChartData {
// // // // // // // // //   name: string;
// // // // // // // // //   value: number;
// // // // // // // // //   fill: string;
// // // // // // // // // }

// // // // // // // // // interface ChartPie {
// // // // // // // // //   dataKey: string; // Just the key from API response
// // // // // // // // //   title?: string; // Optional, will auto-generate if not provided
// // // // // // // // //   description?: string;
// // // // // // // // //   footerText?: string;
// // // // // // // // //   apiEndpoint?: string;
// // // // // // // // //   className?: string;
// // // // // // // // //   // Auto-detection fields (optional)
// // // // // // // // //   nameField?: string; // If not provided, will try to detect
// // // // // // // // //   valueField?: string; // If not provided, will try to detect
// // // // // // // // // }

// // // // // // // // // export function ChartPie({
// // // // // // // // //   dataKey,
// // // // // // // // //   title,
// // // // // // // // //   description,
// // // // // // // // //   footerText,
// // // // // // // // //   apiEndpoint = "/api/statistics/locations",
// // // // // // // // //   className = "",
// // // // // // // // //   nameField,
// // // // // // // // //   valueField,
// // // // // // // // // }: ChartPie) {
// // // // // // // // //   const [chartData, setChartData] = useState<GenericChartData[]>([]);
// // // // // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // // // // //   const [totalCount, setTotalCount] = useState(0);
// // // // // // // // //   const [error, setError] = useState<string | null>(null);

// // // // // // // // //   // Auto-generate title from dataKey if not provided
// // // // // // // // //   const autoTitle =
// // // // // // // // //     title ||
// // // // // // // // //     dataKey
// // // // // // // // //       .replace(/([A-Z])/g, " $1") // Add space before capital letters
// // // // // // // // //       .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
// // // // // // // // //       .replace(/distribution/gi, "Distribution"); // Proper case for 'Distribution'

// // // // // // // // //   const autoDescription =
// // // // // // // // //     description || `Data distribution for ${autoTitle.toLowerCase()}`;
// // // // // // // // //   const autoFooterText =
// // // // // // // // //     footerText || `Showing ${autoTitle.toLowerCase()} data`;

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const fetchData = async () => {
// // // // // // // // //       setIsLoading(true);
// // // // // // // // //       setError(null);

// // // // // // // // //       try {
// // // // // // // // //         const response = await fetch(apiEndpoint);

// // // // // // // // //         if (!response.ok) {
// // // // // // // // //           throw new Error(`HTTP error! status: ${response.status}`);
// // // // // // // // //         }

// // // // // // // // //         const data = await response.json();
// // // // // // // // //         const rawData = data[dataKey];

// // // // // // // // //         if (!rawData || !Array.isArray(rawData)) {
// // // // // // // // //           throw new Error(`No data found for key: ${dataKey}`);
// // // // // // // // //         }

// // // // // // // // //         if (rawData.length === 0) {
// // // // // // // // //           setChartData([]);
// // // // // // // // //           setTotalCount(0);
// // // // // // // // //           return;
// // // // // // // // //         }

// // // // // // // // //         // Auto-detect field names if not provided
// // // // // // // // //         const firstItem = rawData[0];
// // // // // // // // //         const detectedNameField = nameField || detectNameField(firstItem);
// // // // // // // // //         const detectedValueField = valueField || detectValueField(firstItem);

// // // // // // // // //         if (!detectedNameField || !detectedValueField) {
// // // // // // // // //           throw new Error(
// // // // // // // // //             `Could not detect name or value fields in data. Available fields: ${Object.keys(
// // // // // // // // //               firstItem
// // // // // // // // //             ).join(", ")}`
// // // // // // // // //           );
// // // // // // // // //         }

// // // // // // // // //         // Transform data
// // // // // // // // //         const colors = generateDistinctColors(rawData.length);
// // // // // // // // //         const transformedData = rawData.map((item: any, index: number) => ({
// // // // // // // // //           name: item[detectedNameField] || `Item ${index + 1}`,
// // // // // // // // //           value: item[detectedValueField] || 0,
// // // // // // // // //           fill: colors[index],
// // // // // // // // //         }));

// // // // // // // // //         const total = rawData.reduce(
// // // // // // // // //           (sum: number, item: any) => sum + (item[detectedValueField] || 0),
// // // // // // // // //           0
// // // // // // // // //         );

// // // // // // // // //         setChartData(transformedData);
// // // // // // // // //         setTotalCount(total);
// // // // // // // // //       } catch (error) {
// // // // // // // // //         console.error(`Error fetching data for ${dataKey}:`, error);
// // // // // // // // //         setError(error instanceof Error ? error.message : "Unknown error");
// // // // // // // // //       } finally {
// // // // // // // // //         setIsLoading(false);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     fetchData();
// // // // // // // // //   }, [apiEndpoint, dataKey, nameField, valueField]);

// // // // // // // // //   // Auto-detect name field (common patterns)
// // // // // // // // //   const detectNameField = (item: any): string | null => {
// // // // // // // // //     const commonNameFields = [
// // // // // // // // //       "name",
// // // // // // // // //       "label",
// // // // // // // // //       "title",
// // // // // // // // //       "ispName",
// // // // // // // // //       "internetInfra",
// // // // // // // // //       "internetSpeed",
// // // // // // // // //       "opdType",
// // // // // // // // //       "jipStatus",
// // // // // // // // //       "category",
// // // // // // // // //       "type",
// // // // // // // // //       "group",
// // // // // // // // //     ];

// // // // // // // // //     for (const field of commonNameFields) {
// // // // // // // // //       if (item.hasOwnProperty(field)) {
// // // // // // // // //         return field;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     // Fallback: find first string field
// // // // // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // // // // //       if (typeof value === "string") {
// // // // // // // // //         return key;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     return null;
// // // // // // // // //   };

// // // // // // // // //   // Auto-detect value field (common patterns)
// // // // // // // // //   const detectValueField = (item: any): string | null => {
// // // // // // // // //     const commonValueFields = ["count", "value", "total", "amount", "quantity"];

// // // // // // // // //     for (const field of commonValueFields) {
// // // // // // // // //       if (item.hasOwnProperty(field)) {
// // // // // // // // //         return field;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     // Fallback: find first number field
// // // // // // // // //     for (const [key, value] of Object.entries(item)) {
// // // // // // // // //       if (typeof value === "number") {
// // // // // // // // //         return key;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     return null;
// // // // // // // // //   };

// // // // // // // // //   // Generate dynamic chart config
// // // // // // // // //   const chartConfig = chartData.reduce(
// // // // // // // // //     (config: any, item: any, index: number) => {
// // // // // // // // //       const key = createSafeKey(item.name, index);

// // // // // // // // //       config[key] = {
// // // // // // // // //         label: item.name,
// // // // // // // // //         color: `hsl(var(--chart-${(index % 5) + 1}))`,
// // // // // // // // //       };
// // // // // // // // //       return config;
// // // // // // // // //     },
// // // // // // // // //     {
// // // // // // // // //       value: { label: "Value" },
// // // // // // // // //     }
// // // // // // // // //   ) satisfies ChartConfig;

// // // // // // // // //   if (isLoading) {
// // // // // // // // //     return (
// // // // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // // // //           <div>Loading {autoTitle.toLowerCase()}...</div>
// // // // // // // // //         </CardContent>
// // // // // // // // //       </Card>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   if (error) {
// // // // // // // // //     return (
// // // // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // // // //           <div className="text-red-500">Error: {error}</div>
// // // // // // // // //         </CardContent>
// // // // // // // // //       </Card>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   if (chartData.length === 0) {
// // // // // // // // //     return (
// // // // // // // // //       <Card className={`flex flex-col ${className}`}>
// // // // // // // // //         <CardContent className="flex items-center justify-center p-8">
// // // // // // // // //           <div>No data available for {autoTitle.toLowerCase()}</div>
// // // // // // // // //         </CardContent>
// // // // // // // // //       </Card>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <Card className={`flex flex-col ${className}`}>
// // // // // // // // //       <CardHeader className="items-center pb-0">
// // // // // // // // //         <CardTitle>{autoTitle}</CardTitle>
// // // // // // // // //         <CardDescription>{autoDescription}</CardDescription>
// // // // // // // // //       </CardHeader>
// // // // // // // // //       <CardContent className="flex-1 pb-0">
// // // // // // // // //         <ChartContainer
// // // // // // // // //           config={chartConfig}
// // // // // // // // //           className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
// // // // // // // // //         >
// // // // // // // // //           <PieChart>
// // // // // // // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // // // // // //             <Pie data={chartData} dataKey="value" nameKey="name" label />
// // // // // // // // //             <ChartLegend
// // // // // // // // //               content={<ChartLegendContent nameKey="name" />}
// // // // // // // // //               className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
// // // // // // // // //             />
// // // // // // // // //           </PieChart>
// // // // // // // // //         </ChartContainer>
// // // // // // // // //       </CardContent>
// // // // // // // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // // // // // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // // // // // // //           Total {totalCount} items <TrendingUp className="h-4 w-4" />
// // // // // // // // //         </div>
// // // // // // // // //         <div className="text-muted-foreground leading-none">
// // // // // // // // //           {autoFooterText}
// // // // // // // // //         </div>
// // // // // // // // //       </CardFooter>
// // // // // // // // //     </Card>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // // import { Pie, PieChart } from "recharts";
// // // // // // // // // // import {
// // // // // // // // // //   Card,
// // // // // // // // // //   CardContent,
// // // // // // // // // //   CardDescription,
// // // // // // // // // //   CardFooter,
// // // // // // // // // //   CardHeader,
// // // // // // // // // //   CardTitle,
// // // // // // // // // // } from "../ui/card";
// // // // // // // // // // import {
// // // // // // // // // //   ChartConfig,
// // // // // // // // // //   ChartContainer,
// // // // // // // // // //   ChartLegend,
// // // // // // // // // //   ChartLegendContent,
// // // // // // // // // //   ChartTooltip,
// // // // // // // // // //   ChartTooltipContent,
// // // // // // // // // // } from "../ui/chart";
// // // // // // // // // // import { TrendingUp } from "lucide-react";
// // // // // // // // // // import { useEffect, useState } from "react";

// // // // // // // // // // export function ChartPieLabelWithLegend() {
// // // // // // // // // //   const [chartData, setChartData] = useState<any[]>([]);
// // // // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // // // //   const [totalCount, setTotalCount] = useState(0);

// // // // // // // // // //   // const chartData = [
// // // // // // // // // //   //   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
// // // // // // // // // //   //   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
// // // // // // // // // //   //   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
// // // // // // // // // //   //   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
// // // // // // // // // //   //   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// // // // // // // // // //   // ];

// // // // // // // // // //   // const chartConfig = {
// // // // // // // // // //   //   visitors: {
// // // // // // // // // //   //     label: "Visitors",
// // // // // // // // // //   //   },
// // // // // // // // // //   //   chrome: {
// // // // // // // // // //   //     label: "Chrome",
// // // // // // // // // //   //     color: "var(--chart-1)",
// // // // // // // // // //   //   },
// // // // // // // // // //   //   safari: {
// // // // // // // // // //   //     label: "Safari",
// // // // // // // // // //   //     color: "var(--chart-2)",
// // // // // // // // // //   //   },
// // // // // // // // // //   //   firefox: {
// // // // // // // // // //   //     label: "Firefox",
// // // // // // // // // //   //     color: "var(--chart-3)",
// // // // // // // // // //   //   },
// // // // // // // // // //   //   edge: {
// // // // // // // // // //   //     label: "Edge",
// // // // // // // // // //   //     color: "var(--chart-4)",
// // // // // // // // // //   //   },
// // // // // // // // // //   //   other: {
// // // // // // // // // //   //     label: "Other",
// // // // // // // // // //   //     color: "var(--chart-5)",
// // // // // // // // // //   //   },
// // // // // // // // // //   // } satisfies ChartConfig;

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const fetchIspData = async () => {
// // // // // // // // // //       setIsLoading(true);
// // // // // // // // // //       try {
// // // // // // // // // //         const response = await fetch("/api/statistics/locations");

// // // // // // // // // //         if (response.ok) {
// // // // // // // // // //           const data = await response.json();
// // // // // // // // // //           const transformedData = data.ispDistributions.map(
// // // // // // // // // //             (item: any, index: number) => ({
// // // // // // // // // //               ispName: item.ispName,
// // // // // // // // // //               locationCount: item.count,
// // // // // // // // // //               fill: `var(--chart-${(index % 5) + 1})`, // Dynamic colors
// // // // // // // // // //             })
// // // // // // // // // //           );
// // // // // // // // // //           // console.log(data);
// // // // // // // // // //           const total = data.ispDistributions.reduce(
// // // // // // // // // //             (sum: number, item: any) => sum + item.count,
// // // // // // // // // //             0
// // // // // // // // // //           );
// // // // // // // // // //           setChartData(transformedData);
// // // // // // // // // //           setTotalCount(total);
// // // // // // // // // //           console.log("ISP Data:", transformedData);
// // // // // // // // // //         }
// // // // // // // // // //       } catch (error) {
// // // // // // // // // //         console.error("Error fetching ISP Data: ", error);
// // // // // // // // // //       } finally {
// // // // // // // // // //         setIsLoading(false);
// // // // // // // // // //       }
// // // // // // // // // //     };
// // // // // // // // // //     fetchIspData();
// // // // // // // // // //   }, []);

// // // // // // // // // //   // const chartConfig = {
// // // // // // // // // //   //   wired: {
// // // // // // // // // //   //     label: "Wired",
// // // // // // // // // //   //     color: "hsl(var(--chart-1))",
// // // // // // // // // //   //   },
// // // // // // // // // //   //   wireless: {
// // // // // // // // // //   //     label: "Wireless",
// // // // // // // // // //   //     color: "hsl(var(--chart-2))",
// // // // // // // // // //   //   },
// // // // // // // // // //   // } satisfies ChartConfig;

// // // // // // // // // //   // Dynamic chart config based on actual data
// // // // // // // // // //   // const chartConfig = {
// // // // // // // // // //   //   locationCount: {
// // // // // // // // // //   //     label: "Jumlah Lokasi",
// // // // // // // // // //   //   },
// // // // // // // // // //   //   // Generate config for each ISP dynamically
// // // // // // // // // //   //   ...chartData.reduce((config, item, index) => {
// // // // // // // // // //   //     const key = item.ispName
// // // // // // // // // //   //       .toLowerCase()
// // // // // // // // // //   //       .replace(/\s+/g, "")
// // // // // // // // // //   //       .replace(/[^a-z0-9]/g, "");
// // // // // // // // // //   //     config[key] = {
// // // // // // // // // //   //       label: item.ispName,
// // // // // // // // // //   //       color: `hsl(var(--chart-${(index % 5) + 1}))`,
// // // // // // // // // //   //     };
// // // // // // // // // //   //     return config;
// // // // // // // // // //   //   }, {} as any),
// // // // // // // // // //   // } satisfies ChartConfig;

// // // // // // // // // //   // Fixed: Simpler chart config that matches the data structure
// // // // // // // // // //   const chartConfig = chartData.reduce(
// // // // // // // // // //     (config: any, item: any, index: number) => {
// // // // // // // // // //       // Use the exact ispName as the key (cleaned for CSS compatibility)
// // // // // // // // // //       const key = item.ispName.toLowerCase().replace(/[^a-z0-9]/g, "");

// // // // // // // // // //       config[key] = {
// // // // // // // // // //         label: item.ispName,
// // // // // // // // // //         color: `hsl(var(--chart-${(index % 5) + 1}))`,
// // // // // // // // // //       };
// // // // // // // // // //       return config;
// // // // // // // // // //     },
// // // // // // // // // //     {
// // // // // // // // // //       locationCount: {
// // // // // // // // // //         label: "Jumlah Lokasi",
// // // // // // // // // //       },
// // // // // // // // // //     }
// // // // // // // // // //   ) satisfies ChartConfig;

// // // // // // // // // //   if (isLoading) {
// // // // // // // // // //     return <div>Loading ISP distribution...</div>;
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     // <Card className="flex flex-col">
// // // // // // // // // //     //   <CardHeader className="items-center pb-0">
// // // // // // // // // //     //     <CardTitle>Pie Chart - Labels + Legend</CardTitle>
// // // // // // // // // //     //     <CardDescription>January - June 2024</CardDescription>
// // // // // // // // // //     //   </CardHeader>
// // // // // // // // // //     //   <CardContent className="flex-1 pb-0">
// // // // // // // // // //     //     <ChartContainer
// // // // // // // // // //     //       config={chartConfig}
// // // // // // // // // //     //       className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
// // // // // // // // // //     //     >
// // // // // // // // // //     //       <PieChart>
// // // // // // // // // //     //         <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // // // // // // //     //         <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
// // // // // // // // // //     //         <ChartLegend
// // // // // // // // // //     //           content={<ChartLegendContent nameKey="browser" />}
// // // // // // // // // //     //           className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
// // // // // // // // // //     //         />
// // // // // // // // // //     //       </PieChart>
// // // // // // // // // //     //     </ChartContainer>
// // // // // // // // // //     //   </CardContent>
// // // // // // // // // //     //   <CardFooter className="flex-col gap-2 text-sm">
// // // // // // // // // //     //     <div className="flex items-center gap-2 leading-none font-medium">
// // // // // // // // // //     //       Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
// // // // // // // // // //     //     </div>
// // // // // // // // // //     //     <div className="text-muted-foreground leading-none">
// // // // // // // // // //     //       Showing total visitors for the last 6 months
// // // // // // // // // //     //     </div>
// // // // // // // // // //     //   </CardFooter>
// // // // // // // // // //     // </Card>
// // // // // // // // // //     //    (chartData.length === 0) {
// // // // // // // // // //     //   return (
// // // // // // // // // //     //     <Card className="flex flex-col">
// // // // // // // // // //     //       <CardContent className="flex items-center justify-center p-8">
// // // // // // // // // //     //         <div>No ISP data available</div>
// // // // // // // // // //     //       </CardContent>
// // // // // // // // // //     //     </Card>
// // // // // // // // // //     //   );
// // // // // // // // // //     // }

// // // // // // // // // //     <Card className="flex flex-col">
// // // // // // // // // //       <CardHeader className="items-center pb-0">
// // // // // // // // // //         <CardTitle>Distribusi ISP</CardTitle>
// // // // // // // // // //         <CardDescription>Berdasarkan penyedia layanan internet</CardDescription>
// // // // // // // // // //       </CardHeader>
// // // // // // // // // //       <CardContent className="flex-1 pb-0">
// // // // // // // // // //         <ChartContainer
// // // // // // // // // //           config={chartConfig}
// // // // // // // // // //           className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
// // // // // // // // // //         >
// // // // // // // // // //           <PieChart>
// // // // // // // // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // // // // // // //             {/* Fixed: Use proper dataKey and nameKey that match your data */}
// // // // // // // // // //             <Pie
// // // // // // // // // //               data={chartData}
// // // // // // // // // //               dataKey="locationCount" // This matches transformedData
// // // // // // // // // //               nameKey="ispName" // This matches transformedData
// // // // // // // // // //               label
// // // // // // // // // //             />
// // // // // // // // // //             <ChartLegend
// // // // // // // // // //               content={<ChartLegendContent nameKey="ispName" />}
// // // // // // // // // //               className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
// // // // // // // // // //             />
// // // // // // // // // //           </PieChart>
// // // // // // // // // //         </ChartContainer>
// // // // // // // // // //       </CardContent>
// // // // // // // // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // // // // // // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // // // // // // // //           Total {totalCount} lokasi <TrendingUp className="h-4 w-4" />
// // // // // // // // // //         </div>
// // // // // // // // // //         <div className="text-muted-foreground leading-none">
// // // // // // // // // //           Menampilkan distribusi ISP untuk semua lokasi jaringan
// // // // // // // // // //         </div>
// // // // // // // // // //       </CardFooter>
// // // // // // // // // //     </Card>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // // "use client";

// // // // // // // // // // // import { TrendingUp } from "lucide-react";
// // // // // // // // // // // import { Pie, PieChart } from "recharts";

// // // // // // // // // // // import {
// // // // // // // // // // //   Card,
// // // // // // // // // // //   CardContent,
// // // // // // // // // // //   CardDescription,
// // // // // // // // // // //   CardFooter,
// // // // // // // // // // //   CardHeader,
// // // // // // // // // // //   CardTitle,
// // // // // // // // // // // } from "@/components/ui/card";
// // // // // // // // // // // import {
// // // // // // // // // // //   ChartConfig,
// // // // // // // // // // //   ChartContainer,
// // // // // // // // // // //   ChartTooltip,
// // // // // // // // // // //   ChartTooltipContent,
// // // // // // // // // // // } from "@/components/ui/chart";

// // // // // // // // // // // export const description = "A pie chart with a label";

// // // // // // // // // // // const chartData = [
// // // // // // // // // // //   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
// // // // // // // // // // //   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
// // // // // // // // // // //   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
// // // // // // // // // // //   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
// // // // // // // // // // //   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// // // // // // // // // // // ];

// // // // // // // // // // // const chartConfig = {
// // // // // // // // // // //   visitors: {
// // // // // // // // // // //     label: "Visitors",
// // // // // // // // // // //   },
// // // // // // // // // // //   chrome: {
// // // // // // // // // // //     label: "Chrome",
// // // // // // // // // // //     color: "var(--chart-1)",
// // // // // // // // // // //   },
// // // // // // // // // // //   safari: {
// // // // // // // // // // //     label: "Safari",
// // // // // // // // // // //     color: "var(--chart-2)",
// // // // // // // // // // //   },
// // // // // // // // // // //   firefox: {
// // // // // // // // // // //     label: "Firefox",
// // // // // // // // // // //     color: "var(--chart-3)",
// // // // // // // // // // //   },
// // // // // // // // // // //   edge: {
// // // // // // // // // // //     label: "Edge",
// // // // // // // // // // //     color: "var(--chart-4)",
// // // // // // // // // // //   },
// // // // // // // // // // //   other: {
// // // // // // // // // // //     label: "Other",
// // // // // // // // // // //     color: "var(--chart-5)",
// // // // // // // // // // //   },
// // // // // // // // // // // } satisfies ChartConfig;

// // // // // // // // // // // export function ChartPieLabel() {
// // // // // // // // // // //   return (
// // // // // // // // // // //     <Card className="flex flex-col">
// // // // // // // // // // //       <CardHeader className="items-center pb-0">
// // // // // // // // // // //         <CardTitle>Pie Chart - Label</CardTitle>
// // // // // // // // // // //         <CardDescription>January - June 2024</CardDescription>
// // // // // // // // // // //       </CardHeader>
// // // // // // // // // // //       <CardContent className="flex-1 pb-0">
// // // // // // // // // // //         <ChartContainer
// // // // // // // // // // //           config={chartConfig}
// // // // // // // // // // //           className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
// // // // // // // // // // //         >
// // // // // // // // // // //           <PieChart>
// // // // // // // // // // //             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
// // // // // // // // // // //             <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
// // // // // // // // // // //           </PieChart>
// // // // // // // // // // //         </ChartContainer>
// // // // // // // // // // //       </CardContent>
// // // // // // // // // // //       <CardFooter className="flex-col gap-2 text-sm">
// // // // // // // // // // //         <div className="flex items-center gap-2 leading-none font-medium">
// // // // // // // // // // //           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
// // // // // // // // // // //         </div>
// // // // // // // // // // //         <div className="text-muted-foreground leading-none">
// // // // // // // // // // //           Showing total visitors for the last 6 months
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </CardFooter>
// // // // // // // // // // //     </Card>
// // // // // // // // // // //   );
// // // // // // // // // // // }

// // // // // // // // // // // ("use client");

// // // // // // // // // // // import { Pie, PieChart } from "recharts";

// // // // // // // // // // // import {
// // // // // // // // // // //   Card,
// // // // // // // // // // //   CardContent,
// // // // // // // // // // //   CardDescription,
// // // // // // // // // // //   CardHeader,
// // // // // // // // // // //   CardTitle,
// // // // // // // // // // // } from "@/components/ui/card";
// // // // // // // // // // // import {
// // // // // // // // // // //   ChartConfig,
// // // // // // // // // // //   ChartContainer,
// // // // // // // // // // //   ChartLegend,
// // // // // // // // // // //   ChartLegendContent,
// // // // // // // // // // // } from "@/components/ui/chart";

// // // // // // // // // // // export const description = "A pie chart with a legend";

// // // // // // // // // // // const chartData = [
// // // // // // // // // // //   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
// // // // // // // // // // //   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
// // // // // // // // // // //   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
// // // // // // // // // // //   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
// // // // // // // // // // //   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// // // // // // // // // // // ];

// // // // // // // // // // // const chartConfig = {
// // // // // // // // // // //   visitors: {
// // // // // // // // // // //     label: "Visitors",
// // // // // // // // // // //   },
// // // // // // // // // // //   chrome: {
// // // // // // // // // // //     label: "Chrome",
// // // // // // // // // // //     color: "var(--chart-1)",
// // // // // // // // // // //   },
// // // // // // // // // // //   safari: {
// // // // // // // // // // //     label: "Safari",
// // // // // // // // // // //     color: "var(--chart-2)",
// // // // // // // // // // //   },
// // // // // // // // // // //   firefox: {
// // // // // // // // // // //     label: "Firefox",
// // // // // // // // // // //     color: "var(--chart-3)",
// // // // // // // // // // //   },
// // // // // // // // // // //   edge: {
// // // // // // // // // // //     label: "Edge",
// // // // // // // // // // //     color: "var(--chart-4)",
// // // // // // // // // // //   },
// // // // // // // // // // //   other: {
// // // // // // // // // // //     label: "Other",
// // // // // // // // // // //     color: "var(--chart-5)",
// // // // // // // // // // //   },
// // // // // // // // // // // } satisfies ChartConfig;

// // // // // // // // // // // export function ChartPieLegend() {
// // // // // // // // // // //   return (
// // // // // // // // // // //     <Card className="flex flex-col">
// // // // // // // // // // //       <CardHeader className="items-center pb-0">
// // // // // // // // // // //         <CardTitle>Pie Chart - Legend</CardTitle>
// // // // // // // // // // //         <CardDescription>January - June 2024</CardDescription>
// // // // // // // // // // //       </CardHeader>
// // // // // // // // // // //       <CardContent className="flex-1 pb-0">
// // // // // // // // // // //         <ChartContainer
// // // // // // // // // // //           config={chartConfig}
// // // // // // // // // // //           className="mx-auto aspect-square max-h-[300px]"
// // // // // // // // // // //         >
// // // // // // // // // // //           <PieChart>
// // // // // // // // // // //             <Pie data={chartData} dataKey="visitors" />
// // // // // // // // // // //             <ChartLegend
// // // // // // // // // // //               content={<ChartLegendContent nameKey="browser" />}
// // // // // // // // // // //               className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
// // // // // // // // // // //             />
// // // // // // // // // // //           </PieChart>
// // // // // // // // // // //         </ChartContainer>
// // // // // // // // // // //       </CardContent>
// // // // // // // // // // //     </Card>
// // // // // // // // // // //   );
// // // // // // // // // // // }
