import { useState } from "react";
import type { Forecast } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatClock } from "../lib/weatherTime";

export default function HourlyTemp({ data }: { data: Forecast }) {
  const [selected, setSelected] = useState(0);
  const hours = data.list.slice(0, 12).map((hour) => ({
    time: formatClock(hour.dt_formatted),
    temp: hour.main.temp,
    feels: hour.main.feels_like,
  }));
  if (!hours.length) return null;
  const values = hours.flatMap((hour) => [hour.temp, hour.feels]);
  const min = Math.floor((Math.min(...values) - 2) / 5) * 5;
  const max = Math.ceil((Math.max(...values) + 2) / 5) * 5;
  const y = (temp: number) => 236 - ((temp - min) / (max - min || 1)) * 186;
  const x = (index: number) => 58 + index * 65;
  const stepPath = (key: "temp" | "feels") =>
    hours.map((hour, index) => index === 0
      ? "M " + x(index) + " " + y(hour[key])
      : "H " + x(index) + " V " + y(hour[key])).join(" ");
  const active = hours[Math.min(selected, hours.length - 1)];

  return (
    <Card className="pixel-card">
      <CardHeader><div><p className="eyebrow">TEMPERATURE TRACKER</p><CardTitle className="section-title">Next 12 hours</CardTitle></div></CardHeader>
      <CardContent>
        <div className="hourly-chart-scroll">
          <svg viewBox="0 0 800 285" className="hourly-chart" role="group"
            aria-label="Stepped temperature and feels like forecast for the next 12 hours">
            {[0, 1, 2, 3, 4].map((line) => {
              const value = min + (max - min) * line / 4;
              return <g key={line}>
                <line x1="50" x2="785" y1={y(value)} y2={y(value)} stroke="#8da4ba" strokeOpacity=".35" strokeDasharray="4 5" />
                <text x="2" y={y(value) + 4} fill="currentColor" fontSize="13">{value.toFixed(1)}°</text>
              </g>;
            })}
            <path d={stepPath("feels")} fill="none" stroke="#94d7ff" strokeWidth="3" strokeDasharray="6 5" strokeLinejoin="miter" />
            <path d={stepPath("temp")} fill="none" stroke="#ffcf82" strokeWidth="4" strokeLinejoin="miter" />
            {hours.map((hour, index) => (
              <g key={index}>
                <circle cx={x(index)} cy={y(hour.temp)} r={selected === index ? 7 : 5}
                  fill="#ffcf82" stroke="#19263d" strokeWidth="2" tabIndex={0}
                  onFocus={() => setSelected(index)} onMouseEnter={() => setSelected(index)}
                  onClick={() => setSelected(index)}
                  aria-label={hour.time + ": " + hour.temp.toFixed(1) + " degrees, feels like " + hour.feels.toFixed(1) + " degrees"} />
                {index % 2 === 0 && <text x={x(index)} y="272" textAnchor="middle" fill="currentColor" fontSize="13">{hour.time}</text>}
              </g>
            ))}
          </svg>
        </div>
        <div className="chart-readout" aria-live="polite">
          <span>{active.time}</span><strong>{active.temp.toFixed(1)}°C</strong>
          <span>Feels like {active.feels.toFixed(1)}°C</span>
        </div>
        <div className="chart-legend"><span>■ TEMPERATURE</span><span>■ FEELS LIKE</span></div>
      </CardContent>
    </Card>
  );
}
