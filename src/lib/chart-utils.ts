export function getChartColor(variable: string, fallback: string): string {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

  if (!value) {
    return fallback;
  }

  if (value.startsWith("oklch") || value.startsWith("#") || value.startsWith("hsl")) {
    return value;
  }

  return `hsl(${value})`;
}
// C2, C5: removed unused useChartColors() and CHART_COLORS exports
