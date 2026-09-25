import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GeoLocation } from "../api/types";
import { useSearchLocations } from "./hooks/useWeather";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useFavourites } from "./hooks/useFavourites";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Search, Trash } from "pixelarticons/react";
import { formatPlaceName } from "../lib/placeName";

type SavedPlace = Pick<GeoLocation, "name" | "lat" | "lon" | "country" | "state">;

export default function SearchLocation() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const navigate = useNavigate();
  const { history, addHistory, removeHistory } = useSearchHistory();
  const { favourites } = useFavourites();
  const { data: results = [], isFetching, error } = useSearchLocations(debounced);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 280);
    return () => window.clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const select = (place: SavedPlace) => {
    addHistory.mutate({ ...place, query });
    setOpen(false);
    setQuery("");
    const params = new URLSearchParams({
      lat: String(place.lat), lon: String(place.lon), country: place.country,
    });
    if (place.state) params.set("state", place.state);
    navigate("/location/" + encodeURIComponent(place.name) + "?" + params.toString());
  };
  const placeButton = (place: SavedPlace, key: string) => (
    <button key={key} type="button" className="search-result" onClick={() => select(place)}>
      <span><strong>{formatPlaceName(place.name, place.state)}</strong></span>
      <span>{place.country}</span>
    </button>
  );
  return (
    <>
      <Button variant="outline" className="pixel-button search-trigger" aria-label="Search locations" onClick={() => setOpen(true)}>
        <Search className="size-5" /><span>Search locations</span><kbd>Ctrl K</kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="search-dialog pixel-card">
          <DialogHeader>
            <DialogTitle className="section-title">Find a place</DialogTitle>
            <DialogDescription>Search by city or postal code.</DialogDescription>
          </DialogHeader>
          <div className="search-input-wrap">
            <Search className="size-5" />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Type a city name..." aria-label="Search city" />
          </div>
          <div className="search-list">
            {!query && favourites.length > 0 && (
              <section><p className="eyebrow">FAVOURITES</p>
                {favourites.map((place) => placeButton(place, "f-" + place.id))}
              </section>
            )}
            {!query && history.length > 0 && (
              <section>
                <div className="flex items-center justify-between">
                  <p className="eyebrow">RECENT LOCATIONS</p>
                  <button className="clear-history" type="button" onClick={() => removeHistory.mutate()}
                    aria-label="Clear recent locations"><Trash className="size-4" /></button>
                </div>
                {history.map((place) => placeButton(place, "h-" + place.id))}
              </section>
            )}
            {query.trim().length >= 2 && (
              <section><p className="eyebrow">SEARCH RESULTS</p>
                {isFetching ? <p className="search-message">Searching...</p> :
                  error ? <p className="search-message">Search is unavailable. Try again.</p> :
                  results.length ? results.map((place) => placeButton(place, "r-" + place.lat + "-" + place.lon)) :
                    <p className="search-message">No places found. Try a nearby city.</p>}
              </section>
            )}
            {query.trim().length === 1 && <p className="search-message">Type at least two letters.</p>}
            {!query && !history.length && !favourites.length &&
              <p className="search-message">Your recent and favourite cities will appear here.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
