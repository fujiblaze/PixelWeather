import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PixelSunrise({ className, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" shapeRendering="crispEdges" fill="currentColor" className={className} aria-hidden="true" {...props}>
    <path d="M11 1h2v2h2v2h-2v5h-2V5H9V3h2zM8 12h2v-2h4v2h2v4H8zM3 18h18v2H3zM1 22h22v2H1z" />
  </svg>;
}

export function PixelSunset({ className, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" shapeRendering="crispEdges" fill="currentColor" className={className} aria-hidden="true" {...props}>
    <path d="M11 1h2v5h2v2h-2v2h-2V8H9V6h2zM8 12h2v-2h4v2h2v4H8zM3 18h18v2H3zM1 22h22v2H1z" />
  </svg>;
}

export function PixelPressure({ className, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" shapeRendering="crispEdges" fill="currentColor" className={className} aria-hidden="true" {...props}>
    <path d="M8 2h8v2H8zM5 4h3v2H5zM16 4h3v2h-3zM3 6h2v3H3zM19 6h2v3h-2zM2 9h2v6H2zM20 9h2v6h-2zM4 15h2v3H4zM18 15h2v3h-2zM6 18h12v2H6zM11 10h2v4h-2zM13 8h2v2h-2z" />
  </svg>;
}
