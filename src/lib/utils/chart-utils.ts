import { ChartConfig } from "@/components/ui/chart";

export interface GenericChartDataType {
  name: string;
  value: number;
  fill: string;
}

export const generateDistinctColors = (count: number): string[] => {
  const baseColors = [
    "oklch(0.646 0.222 41.116)",
    "oklch(0.6 0.118 184.704)",
    "oklch(0.398 0.07 227.392)",
    "oklch(0.828 0.189 84.429)",
    "oklch(0.769 0.188 70.08)",
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
