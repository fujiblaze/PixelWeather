import type { PropsWithChildren } from "react";
import Header from "./header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto min-h-[calc(100vh-9rem)] px-4 py-8">
        {children}
      </main>
      <footer className="site-footer">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 text-sm">
          <p><span className="copyright-symbol">©</span> {new Date().getFullYear()} made by fujimori_</p>
          <p>Pixel art: <a href="https://opengameart.org/users/craftpixnet-2d-game-assets" target="_blank" rel="noreferrer">CraftPix.net</a>
            {" / "}<a href="https://najjar320.itch.io/vista-parallax-backgrounds" target="_blank" rel="noreferrer">najjar320</a>{" · "}Weather: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></p>
        </div>
      </footer>
    </div>
  );
}
