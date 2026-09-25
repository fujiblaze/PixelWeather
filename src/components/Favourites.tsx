import { Link } from "react-router-dom";
import { useFavourites } from "./hooks/useFavourites";
import { useWeather } from "./hooks/useWeather";
import WeatherIcon from "./WeatherIcon";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { FavouriteCity } from "./hooks/useFavourites";

export default function Favourites() {
  const { favourites, removeFavourites } = useFavourites();
  if (!favourites.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between"><h2 className="section-title">Favourites</h2>
        <span className="eyebrow">{favourites.length} / 10 SAVED</span></div>
      <div className="favourites-strip">
        {favourites.map((city) => <FavouriteTile key={city.id} city={city}
          onRemove={() => { removeFavourites.mutate(city.id); toast.message(city.name + " removed from favourites."); }} />)}
      </div>
    </section>
  );
}

function FavouriteTile({ city, onRemove }: { city: FavouriteCity; onRemove: () => void }) {
  const { data, error } = useWeather({ lat: city.lat, lon: city.lon });
  const params = new URLSearchParams({
    lat: String(city.lat), lon: String(city.lon), country: city.country,
  });
  if (city.state) params.set("state", city.state);
  return (
    <div className="favourite-tile">
      <Link to={"/location/" + encodeURIComponent(city.name) + "?" + params.toString()}
        className="favourite-link" aria-label={"View weather in " + city.name}>
        {data ? <WeatherIcon code={data.weather[0].id} icon={data.weather[0].icon} className="size-12 shrink-0" /> :
          <span className="favourite-placeholder">··</span>}
        <span className="min-w-0"><strong>{city.name}</strong><small>{city.country || city.state}</small></span>
        <span className="favourite-temp">{data ? data.main.temp.toFixed(1) + "°" : error ? "!" : "..."}</span>
      </Link>
      <button type="button" className="favourite-remove" onClick={onRemove}
        aria-label={"Remove " + city.name + " from favourites"}><Trash2 className="size-4" /></button>
    </div>
  );
}
