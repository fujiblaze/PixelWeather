import { Link } from "react-router-dom";
import { Moon, Sun } from "pixelarticons/react";
import { useTheme } from "./themes/theme-context";
import SearchLocation from "./SearchLocation";

function BrandMark() {
  return <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" className="brand-mark">
    <path fill="#263e58" d="M0 0h16v16H0z" />
    <path fill="#ffdb83" d="M8 1h2v2H8zM4 3h2v2H4zM12 3h2v2h-2zM7 4h4v1H7zM6 5h6v4H6zM2 7h2v2H2zM13 7h2v2h-2z" />
    <path fill="#fff2c2" d="M3 10h3V9h5v1h2v1h2v3H2v-2h1z" />
    <path fill="#9dd8f4" d="M2 13h13v1H2z" />
  </svg>;
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const dark = theme !== "light";
  return (
    <header className="site-header">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <Link to="/" className="brand" aria-label="Pixel Weather home">
          <span className="brand-icon"><BrandMark /></span>
          <span className="brand-wordmark">PIXEL<span className="brand-accent">/</span>WEATHER<small>FORECAST TERMINAL</small></span>
        </Link>
        <div className="flex items-center gap-3">
          <SearchLocation />
          <button type="button" className="theme-toggle pixel-button" onClick={() => setTheme(dark ? "light" : "dark")}
            aria-label={"Switch to " + (dark ? "light" : "dark") + " mode"}>
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
