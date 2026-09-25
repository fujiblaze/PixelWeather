import type { Weather, GeoLocation } from "../api/types";
import { ArrowUp, ArrowDown } from "pixelarticons/react";
import { Card, CardContent } from "./ui/card";
import WeatherIcon from "./WeatherIcon";
import { formatClock } from "../lib/weatherTime";
import { formatPlaceName } from "../lib/placeName";

interface Props { data: Weather; locationName?: GeoLocation }

export default function CurrentWeather({ data, locationName }: Props) {
  const condition = data.weather[0];
  const city = locationName?.name || data.name;
  return (
    <Card className="pixel-card hero-card overflow-hidden">
      <CardContent className="p-6 md:p-9">
        <div className="grid gap-6 md:grid-cols-[1fr_220px]">
          <div className="space-y-6">
            <div>
              <p className="eyebrow">LIVE CONDITIONS / {data.timezone}</p>
              <h2 className="hero-location">{formatPlaceName(city, locationName?.state)}</h2>
              <p className="weather-meta">{locationName?.country || "Local weather"} · Updated {formatClock(data.localTime)}</p>
            </div>
            <div className="flex flex-wrap items-end gap-5">
              <p className="hero-temp">{data.main.temp.toFixed(2)}°<span>C</span></p>
              <div className="space-y-2 pb-2">
                <p className="text-lg text-muted-foreground">Feels like {data.main.feels_like.toFixed(1)}°C</p>
                <p className="temperature-range">
                  <span className="range-high"><ArrowUp aria-hidden="true" />{data.main.temp_max.toFixed(1)}°C</span>
                  <span className="range-low"><ArrowDown aria-hidden="true" />{data.main.temp_min.toFixed(1)}°C</span>
                </p>
              </div>
            </div>
            <div className="hero-stats">
              <div><span className="stat-label">HUMIDITY</span><strong>{data.main.humidity.toFixed(1)}%</strong></div>
              <div><span className="stat-label">WIND</span><strong>{data.wind.speed.toFixed(1)} m/s</strong></div>
              <div><span className="stat-label">GUSTS</span><strong>{data.wind.gust.toFixed(1)} m/s</strong></div>
            </div>
          </div>
          <div className="weather-portrait">
            <WeatherIcon code={condition.id} icon={condition.icon} className="weather-glyph" />
            <p>{condition.description}</p>
            <span className="eyebrow">SCENE {String(condition.id).padStart(3, "0")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
