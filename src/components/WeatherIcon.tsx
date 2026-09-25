import { weatherScene } from "../lib/weatherScene";

interface WeatherIconProps {
  code: number;
  icon: string;
  className?: string;
}

export default function WeatherIcon({ code, icon, className = "" }: WeatherIconProps) {
  const scene = weatherScene(code, icon);
  const hasSun = scene === "clear" || (scene === "clouds" && code <= 802 && !icon.endsWith("n"));
  const hasCloud = ["clouds", "rain", "snow", "storm", "mist"].includes(scene);
  return (
    <svg className={className} viewBox="0 0 32 32" role="img" aria-label={scene + " weather"} shapeRendering="crispEdges">
      {hasSun && (
        <g fill="#ffd778">
          <rect x="19" y="3" width="6" height="2" /><rect x="19" y="15" width="6" height="2" />
          <rect x="14" y="8" width="2" height="5" /><rect x="28" y="8" width="2" height="5" />
          <rect x="18" y="7" width="8" height="8" /><rect x="16" y="5" width="2" height="2" />
          <rect x="26" y="5" width="2" height="2" />
        </g>
      )}
      {scene === "night" && (
        <g fill="#f7e4a1">
          <rect x="15" y="4" width="3" height="13" /><rect x="18" y="14" width="10" height="3" />
          <rect x="20" y="17" width="6" height="3" /><rect x="9" y="6" width="2" height="2" />
          <rect x="5" y="11" width="2" height="2" />
        </g>
      )}
      {hasCloud && (
        <g>
          <path d="M5 15h4v-4h4V8h9v3h4v4h3v8H5z" fill="#26334c" />
          <path d="M7 15h4v-4h10v3h5v2h2v5H7z" fill={scene === "storm" ? "#8895b9" : "#e3eaf0"} />
          <rect x="9" y="21" width="17" height="2" fill="#aabbd0" />
        </g>
      )}
      {scene === "rain" && (
        <g fill="#71c7ed"><rect x="9" y="25" width="2" height="4" /><rect x="17" y="24" width="2" height="5" /><rect x="25" y="25" width="2" height="4" /></g>
      )}
      {scene === "snow" && (
        <g fill="#d5f3ff"><rect x="9" y="26" width="3" height="3" /><rect x="17" y="25" width="3" height="3" /><rect x="25" y="26" width="3" height="3" /></g>
      )}
      {scene === "storm" && <path d="M16 23h8l-5 4h3l-8 5 2-6h-3z" fill="#ffd778" />}
      {scene === "mist" && <g fill="#d3e0e8"><rect x="5" y="25" width="23" height="2" /><rect x="8" y="29" width="17" height="2" /></g>}
    </svg>
  );
}
