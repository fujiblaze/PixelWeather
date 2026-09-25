export type WeatherScene = "clear" | "clouds" | "rain" | "snow" | "storm" | "mist" | "night";

export function weatherScene(code: number, icon: string): WeatherScene {
  if (code >= 200 && code < 300) return "storm";
  if (code >= 300 && code < 600) return "rain";
  if (code >= 600 && code < 700) return "snow";
  if (code >= 700 && code < 800) return "mist";
  if ((code === 800 || code === 801) && icon.endsWith("n")) return "night";
  if (code === 800) return "clear";
  return "clouds";
}
