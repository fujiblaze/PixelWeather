import type { Forecast as ForecastData, WeatherCondition } from "../api/types";
import { ArrowDown, ArrowUp } from "pixelarticons/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import WeatherIcon from "./WeatherIcon";
import { formatDay } from "../lib/weatherTime";

interface Daily {
  date: string; min: number; max: number; humidity: number; wind: number;
  weather: WeatherCondition; count: number;
}

export default function Forecast({ data }: { data: ForecastData }) {
  const today = data.list[0]?.dt_formatted.slice(0, 10);
  const days = new Map<string, Daily>();
  for (const hour of data.list) {
    const date = hour.dt_formatted.slice(0, 10);
    if (date === today) continue;
    const item = days.get(date);
    if (!item) {
      days.set(date, {
        date, min: hour.main.temp_min, max: hour.main.temp_max,
        humidity: hour.main.humidity, wind: hour.wind.speed,
        weather: hour.weather[0], count: 1,
      });
    } else {
      item.min = Math.min(item.min, hour.main.temp_min);
      item.max = Math.max(item.max, hour.main.temp_max);
      item.humidity += hour.main.humidity;
      item.wind = Math.max(item.wind, hour.wind.speed);
      item.count += 1;
      if (hour.dt_formatted.slice(11, 13) === "12") item.weather = hour.weather[0];
    }
  }
  return (
    <Card className="pixel-card">
      <CardHeader><div><p className="eyebrow">LOOKING AHEAD</p><CardTitle className="section-title">5-day forecast</CardTitle></div></CardHeader>
      <CardContent className="space-y-2">
        {[...days.values()].slice(0, 5).map((day) => (
          <div key={day.date} className="forecast-row">
            <WeatherIcon code={day.weather.id} icon={day.weather.icon} className="forecast-glyph" />
            <div className="forecast-day"><strong>{formatDay(day.date)}</strong><span>{day.weather.description}</span></div>
            <div className="forecast-values">
              <span className="range-high"><ArrowUp aria-hidden="true" />{day.max.toFixed(1)}°</span>
              <span className="range-low"><ArrowDown aria-hidden="true" />{day.min.toFixed(1)}°</span>
            </div>
            <div className="forecast-extra"><span>{(day.humidity / day.count).toFixed(1)}% RH</span>
              <span>{day.wind.toFixed(1)} m/s</span></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
