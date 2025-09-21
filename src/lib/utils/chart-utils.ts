// src/lib/utils/chart-utils.ts
import { ChartConfig } from "@/components/ui/chart";

export interface GenericChartDataType {
  name: string;
  value: number;
  fill: string;
}

export const generateDistinctColors = (count: number): string[] => {
  const baseColors = [
    "oklch(0.646 0.222 41.116)", // --chart-1
    "oklch(0.6 0.118 184.704)", // --chart-2
    "oklch(0.398 0.07 227.392)", // --chart-3
    "oklch(0.828 0.189 84.429)", // --chart-4
    "oklch(0.769 0.188 70.08)", // --chart-5
  ];

  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i < 5) {
      colors.push(baseColors[i]);
    } else {
      const hue = (i * 137.508) % 360;
      colors.push(`hsl(${hue}, 65%, 50%)`);
    }
  }

  return colors;
};

export const createSafeKey = (name: string, fallbackIndex: number): string => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");

  return base || `item_${fallbackIndex}`;
};

export const generateChartConfig = (
  data: GenericChartDataType[]
): ChartConfig => {
  const config: ChartConfig = {
    value: { label: "Count" },
  };

  data.forEach((item, index) => {
    const key = createSafeKey(item.name, index);
    config[key] = {
      label: item.name,
      color: item.fill,
    };
  });

  return config;
};

// // src/lib/utils/chart-utils.ts
// import { ChartConfig } from "@/components/ui/chart";

// export interface GenericChartDataType {
//   name: string;
//   value: number;
//   fill: string;
// }

// export const generateDistinctColors = (count: number): string[] => {
//   // Use direct oklch values from your globals.css
//   const baseColors = [
//     "oklch(0.646 0.222 41.116)", // --chart-1
//     "oklch(0.6 0.118 184.704)", // --chart-2
//     "oklch(0.398 0.07 227.392)", // --chart-3
//     "oklch(0.828 0.189 84.429)", // --chart-4
//     "oklch(0.769 0.188 70.08)", // --chart-5
//   ];

//   const colors: string[] = [];

//   for (let i = 0; i < count; i++) {
//     if (i < 5) {
//       colors.push(baseColors[i]);
//     } else {
//       // Generate additional colors for more than 5 items
//       const hue = (i * 137.508) % 360;
//       colors.push(`hsl(${hue}, 65%, 50%)`);
//     }
//   }

//   return colors;
// };

// export const createSafeKey = (name: string, fallbackIndex: number): string => {
//   const base = name
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, "_")
//     .replace(/_{2,}/g, "_")
//     .replace(/^_|_$/g, "");

//   return base || `item_${fallbackIndex}`;
// };

// export const generateChartConfig = (
//   data: GenericChartDataType[]
// ): ChartConfig => {
//   const config: ChartConfig = {
//     value: {
//       label: "Count",
//     },
//   };

//   data.forEach((item, index) => {
//     const key = createSafeKey(item.name, index);
//     config[key] = {
//       label: item.name,
//       color: item.fill,
//     };
//   });

//   return config;
// };

// // // src/lib/utils/chart-utils.ts
// // import { ChartConfig } from "@/components/ui/chart";

// // export interface GenericChartDataType {
// //   name: string;
// //   value: number;
// //   fill: string;
// // }

// // export const generateDistinctColors = (count: number): string[] => {
// //   // These match your globals.css exactly
// //   const baseColors = [
// //     "oklch(0.646 0.222 41.116)", // --chart-1
// //     "oklch(0.6 0.118 184.704)", // --chart-2
// //     "oklch(0.398 0.07 227.392)", // --chart-3
// //     "oklch(0.828 0.189 84.429)", // --chart-4
// //     "oklch(0.769 0.188 70.08)", // --chart-5
// //   ];

// //   const colors: string[] = [];

// //   for (let i = 0; i < count; i++) {
// //     if (i < 5) {
// //       colors.push(baseColors[i]);
// //     } else {
// //       // Generate additional colors
// //       const hue = (i * 137.508) % 360;
// //       colors.push(`hsl(${hue}, 65%, 50%)`);
// //     }
// //   }

// //   return colors;
// // };

// // export const createSafeKey = (name: string, fallbackIndex: number): string => {
// //   const base = name
// //     .toLowerCase()
// //     .replace(/[^a-z0-9]/g, "_")
// //     .replace(/_{2,}/g, "_")
// //     .replace(/^_|_$/g, "");

// //   return base || `item_${fallbackIndex}`;
// // };

// // export const generateChartConfig = (
// //   data: GenericChartDataType[]
// // ): ChartConfig => {
// //   const config: ChartConfig = {
// //     value: {
// //       label: "Count",
// //     },
// //   };

// //   data.forEach((item, index) => {
// //     const key = createSafeKey(item.name, index);
// //     config[key] = {
// //       label: item.name,
// //       color: item.fill,
// //     };
// //   });

// //   return config;
// // };

// // // // src/lib/utils/chart-utils.ts
// // // import { ChartConfig } from "@/components/ui/chart";

// // // export interface GenericChartDataType {
// // //   name: string;
// // //   value: number;
// // //   fill: string;
// // // }

// // // export const generateDistinctColors = (count: number): string[] => {
// // //   const colors: string[] = [];

// // //   for (let i = 0; i < count; i++) {
// // //     if (i < 5) {
// // //       // Use the correct CSS variable format from your globals.css
// // //       colors.push(`oklch(var(--chart-${i + 1}))`);
// // //     } else {
// // //       // Generate additional colors as hsl for extra items
// // //       const hue = (i * 137.508) % 360;
// // //       colors.push(`hsl(${hue}, 65%, 50%)`);
// // //     }
// // //   }

// // //   return colors;
// // // };

// // // export const createSafeKey = (name: string, fallbackIndex: number): string => {
// // //   const base = name
// // //     .toLowerCase()
// // //     .replace(/[^a-z0-9]/g, "_")
// // //     .replace(/_{2,}/g, "_")
// // //     .replace(/^_|_$/g, "");

// // //   return base || `item_${fallbackIndex}`;
// // // };

// // // export const generateChartConfig = (
// // //   data: GenericChartDataType[]
// // // ): ChartConfig => {
// // //   const config: ChartConfig = {
// // //     value: {
// // //       label: "Count",
// // //     },
// // //   };

// // //   data.forEach((item, index) => {
// // //     const key = createSafeKey(item.name, index);
// // //     config[key] = {
// // //       label: item.name,
// // //       color: item.fill, // Use the actual color from data
// // //     };
// // //   });

// // //   return config;
// // // };

// // // // // src/lib/utils/chart-utils.ts
// // // // import { ChartConfig } from "@/components/ui/chart";

// // // // export interface GenericChartDataType {
// // // //   name: string;
// // // //   value: number;
// // // //   fill: string;
// // // // }

// // // // export const generateDistinctColors = (count: number): string[] => {
// // // //   const colors: string[] = [];

// // // //   for (let i = 0; i < count; i++) {
// // // //     if (i < 5) {
// // // //       colors.push(`hsl(var(--chart-${i + 1}))`);
// // // //     } else {
// // // //       // Generate more colors if needed
// // // //       const hue = (i * 137.508) % 360; // Golden angle for good distribution
// // // //       colors.push(`hsl(${hue}, 65%, 50%)`);
// // // //     }
// // // //   }

// // // //   return colors;
// // // // };

// // // // export const createSafeKey = (name: string, fallbackIndex: number): string => {
// // // //   const base = name
// // // //     .toLowerCase()
// // // //     .replace(/[^a-z0-9]/g, "_")
// // // //     .replace(/_{2,}/g, "_")
// // // //     .replace(/^_|_$/g, "");

// // // //   return base || `item_${fallbackIndex}`;
// // // // };

// // // // export const generateChartConfig = (
// // // //   data: GenericChartDataType[]
// // // // ): ChartConfig => {
// // // //   const config: ChartConfig = {
// // // //     value: {
// // // //       label: "Count",
// // // //     },
// // // //   };

// // // //   data.forEach((item, index) => {
// // // //     const key = createSafeKey(item.name, index);
// // // //     config[key] = {
// // // //       label: item.name,
// // // //       color: item.fill, // Use the actual color from data
// // // //     };
// // // //   });

// // // //   return config;
// // // // };

// // // // // // src/lib/utils/chart-utils.ts
// // // // // export interface GenericChartDataType {
// // // // //   name: string;
// // // // //   value: number;
// // // // //   fill: string;
// // // // // }

// // // // // // export const generateDistinctColors = (count: number): string[] => {
// // // // // //   const colors: string[] = [];

// // // // // //   for (let i = 0; i < count; i++) {
// // // // // //     if (i < 5) {
// // // // // //       colors.push(`hsl(var(--chart-${i + 1}))`);
// // // // // //     } else {
// // // // // //       // Generate more colors if needed
// // // // // //       const hue = (i * 137.508) % 360; // Golden angle for good distribution
// // // // // //       colors.push(`hsl(${hue}, 65%, 50%)`);
// // // // // //     }
// // // // // //   }

// // // // // //   return colors;
// // // // // // };

// // // // // export const generateDistinctColors = (count: number): string[] => {
// // // // //   const colors: string[] = [];
// // // // //   const goldenRatio = 0.618033988749895;
// // // // //   let hue = 0;

// // // // //   for (let i = 0; i < count; i++) {
// // // // //     if (i < 5) {
// // // // //       colors.push(`hsl(var(--chart-${i + 1}))`);
// // // // //     } else {
// // // // //       hue = (hue + goldenRatio * 360) % 360;
// // // // //       // Ensure good contrast and readability
// // // // //       const saturation = 65 + (i % 2) * 10; // 65% or 75%
// // // // //       const lightness = 45 + (i % 3) * 5; // 45%, 50%, or 55%
// // // // //       colors.push(`hsl(${Math.floor(hue)}, ${saturation}%, ${lightness}%)`);
// // // // //     }
// // // // //   }

// // // // //   return colors;
// // // // // };

// // // // // export const createSafeKey = (name: string, fallbackIndex: number): string => {
// // // // //   const base = name
// // // // //     .toLowerCase()
// // // // //     .replace(/[^a-z0-9]/g, "_")
// // // // //     .replace(/_{2,}/g, "_")
// // // // //     .replace(/^_|_$/g, "");

// // // // //   return base || `item_${fallbackIndex}`;
// // // // // };

// // // // // // // src/lib/utils/chart-utils.ts
// // // // // // import { ChartConfig } from "@/components/ui/chart";

// // // // // // // Generic chart data type that works for any data
// // // // // // export interface GenericChartDataType {
// // // // // //   name: string;
// // // // // //   value: number;
// // // // // //   fill: string;
// // // // // // }

// // // // // // // Configuration for different chart types
// // // // // // export type ChartDataType =
// // // // // //   | "ispDistributions"
// // // // // //   | "infrastructureDistribution"
// // // // // //   | "internetSpeed"
// // // // // //   | "opdType"
// // // // // //   | "jipStatus";

// // // // // // export interface ChartTypeConfig {
// // // // // //   title: string;
// // // // // //   description: string;
// // // // // //   footerText: string;
// // // // // //   dataKey: string; // The key in API response
// // // // // //   nameField: string; // Field name for the label
// // // // // //   valueField: string; // Field name for the value
// // // // // // }

// // // // // // // Configuration mapping for all chart types
// // // // // // export const CHART_TYPE_CONFIGS: Record<ChartDataType, ChartTypeConfig> = {
// // // // // //   ispDistributions: {
// // // // // //     title: "Distribusi ISP",
// // // // // //     description: "Berdasarkan penyedia layanan internet",
// // // // // //     footerText: "Menampilkan distribusi ISP untuk semua lokasi jaringan",
// // // // // //     dataKey: "ispDistributions",
// // // // // //     nameField: "ispName",
// // // // // //     valueField: "count",
// // // // // //   },
// // // // // //   infrastructureDistribution: {
// // // // // //     title: "Distribusi Infrastruktur",
// // // // // //     description: "Kabel vs Wireless",
// // // // // //     footerText: "Menampilkan distribusi tipe infrastruktur jaringan",
// // // // // //     dataKey: "infrastructureDistribution",
// // // // // //     nameField: "internetInfra",
// // // // // //     valueField: "count",
// // // // // //   },
// // // // // //   internetSpeed: {
// // // // // //     title: "Distribusi Kecepatan Internet",
// // // // // //     description: "Berdasarkan kecepatan koneksi",
// // // // // //     footerText: "Menampilkan distribusi kecepatan internet",
// // // // // //     dataKey: "internetSpeed",
// // // // // //     nameField: "internetSpeed",
// // // // // //     valueField: "count",
// // // // // //   },
// // // // // //   opdType: {
// // // // // //     title: "Distribusi Tipe OPD",
// // // // // //     description: "Berdasarkan jenis organisasi perangkat daerah",
// // // // // //     footerText: "Menampilkan distribusi tipe OPD",
// // // // // //     dataKey: "opdTypeDistribution", // This would be in your API
// // // // // //     nameField: "opdType",
// // // // // //     valueField: "count",
// // // // // //   },
// // // // // //   jipStatus: {
// // // // // //     title: "Status JIP",
// // // // // //     description: "Checked vs Unchecked",
// // // // // //     footerText: "Menampilkan status JIP untuk semua lokasi",
// // // // // //     dataKey: "jipStatusDistribution", // This would be in your API
// // // // // //     nameField: "jipStatus",
// // // // // //     valueField: "count",
// // // // // //   },
// // // // // // };

// // // // // // export const generateDistinctColors = (count: number): string[] => {
// // // // // //   const colors: string[] = [];
// // // // // //   const goldenRatio = 0.618033988749895;
// // // // // //   let hue = 0;

// // // // // //   for (let i = 0; i < count; i++) {
// // // // // //     if (i < 5) {
// // // // // //       colors.push(`hsl(var(--chart-${i + 1}))`);
// // // // // //     } else {
// // // // // //       hue = (hue + goldenRatio * 360) % 360;
// // // // // //       const saturation = 65 + (i % 2) * 10;
// // // // // //       const lightness = 45 + (i % 3) * 5;
// // // // // //       colors.push(`hsl(${Math.floor(hue)}, ${saturation}%, ${lightness}%)`);
// // // // // //     }
// // // // // //   }

// // // // // //   return colors;
// // // // // // };

// // // // // // export const createSafeKey = (name: string, fallbackIndex: number): string => {
// // // // // //   const base = name
// // // // // //     .toLowerCase()
// // // // // //     .replace(/[^a-z0-9]/g, "_")
// // // // // //     .replace(/_{2,}/g, "_")
// // // // // //     .replace(/^_|_$/g, "");

// // // // // //   return base || `item_${fallbackIndex}`;
// // // // // // };

// // // // // // export const generateChartConfig = (
// // // // // //   data: GenericChartDataType[]
// // // // // // ): ChartConfig => {
// // // // // //   const colors = generateDistinctColors(data.length);

// // // // // //   const config: ChartConfig = {
// // // // // //     value: {
// // // // // //       label: "Count",
// // // // // //     },
// // // // // //   };

// // // // // //   data.forEach((item, index) => {
// // // // // //     const key = createSafeKey(item.name, index);
// // // // // //     config[key] = {
// // // // // //       label: item.name,
// // // // // //       color: colors[index],
// // // // // //     };
// // // // // //   });

// // // // // //   return config;
// // // // // // };

// // // // // // // Transform API data to generic chart format
// // // // // // export const transformApiDataToChart = (
// // // // // //   apiData: any[],
// // // // // //   config: ChartTypeConfig
// // // // // // ): GenericChartDataType[] => {
// // // // // //   const colors = generateDistinctColors(apiData.length);

// // // // // //   return apiData.map((item, index) => ({
// // // // // //     name: item[config.nameField] || `Item ${index + 1}`,
// // // // // //     value: item[config.valueField] || 0,
// // // // // //     fill: colors[index],
// // // // // //   }));
// // // // // // };

// // // // // // // import { ChartConfig } from "@/components/ui/chart";

// // // // // // // // Define your chart data type
// // // // // // // export interface IspNameChartDataType {
// // // // // // //   ispName: string;
// // // // // // //   locationCount: number;
// // // // // // //   fill: string;
// // // // // // // }

// // // // // // // const generateDistinctColors = (count: number): string[] => {
// // // // // // //   const colors: string[] = [];
// // // // // // //   const goldenRatio = 0.618033988749895;
// // // // // // //   let hue = 0;

// // // // // // //   for (let i = 0; i < count; i++) {
// // // // // // //     if (i < 5) {
// // // // // // //       colors.push(`hsl(var(--chart-${i + 1}))`);
// // // // // // //     } else {
// // // // // // //       hue = (hue + goldenRatio * 360) % 360;
// // // // // // //       // Ensure good contrast and readability
// // // // // // //       const saturation = 65 + (i % 2) * 10; // 65% or 75%
// // // // // // //       const lightness = 45 + (i % 3) * 5; // 45%, 50%, or 55%
// // // // // // //       colors.push(`hsl(${Math.floor(hue)}, ${saturation}%, ${lightness}%)`);
// // // // // // //     }
// // // // // // //   }

// // // // // // //   return colors;
// // // // // // // };

// // // // // // // const createSafeKey = (name: string, fallbackIndex: number): string => {
// // // // // // //   const base = name
// // // // // // //     .toLowerCase()
// // // // // // //     .replace(/[^a-z0-9]/g, "_")
// // // // // // //     .replace(/_{2,}/g, "_")
// // // // // // //     .replace(/^_|_$/g, "");

// // // // // // //   return base || `item_${fallbackIndex}`;
// // // // // // // };

// // // // // // // const generateChartConfig = (data: IspNameChartDataType[]): ChartConfig => {
// // // // // // //   const colors = generateDistinctColors(data.length);

// // // // // // //   const config: ChartConfig = {
// // // // // // //     locationCount: {
// // // // // // //       label: "Jumlah Lokasi",
// // // // // // //     },
// // // // // // //   };

// // // // // // //   data.forEach((item, index) => {
// // // // // // //     const key = createSafeKey(item.ispName, index);
// // // // // // //     config[key] = {
// // // // // // //       label: item.ispName,
// // // // // // //       color: colors[index],
// // // // // // //     };
// // // // // // //   });

// // // // // // //   return config;
// // // // // // // };
