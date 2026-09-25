import type { Weather } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Compass } from "pixelarticons/react";
import { PixelPressure, PixelSunrise, PixelSunset } from "./PixelDetailIcons";
import { formatUtcClock } from "../lib/weatherTime";

export default function Details({ data }: { data: Weather }) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const direction = directions[Math.round(data.wind.deg / 45) % 8];
  const details = [
    { title: "Sunrise", value: formatUtcClock(data.sys.sunrise), Icon: PixelSunrise },
    { title: "Sunset", value: formatUtcClock(data.sys.sunset), Icon: PixelSunset },
    { title: "Wind direction", value: direction + " / " + data.wind.deg.toFixed(1) + "°", Icon: Compass },
    { title: "Pressure", value: data.main.pressure.toFixed(1) + " hPa", Icon: PixelPressure },
  ];
  return (
    <Card className="pixel-card">
      <CardHeader><div><p className="eyebrow">LOCAL READOUT</p><CardTitle className="section-title">Weather details</CardTitle></div></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {details.map(({ title, value, Icon }) => (
          <div key={title} className="detail-tile">
            <Icon className="size-7 text-[#ffcf82]" />
            <div><p className="stat-label">{title}</p><strong>{value}</strong></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
