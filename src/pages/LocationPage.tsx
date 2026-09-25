import { useParams, useSearchParams } from "react-router-dom";
import { useForecast, useWeather } from "../components/hooks/useWeather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import LoadingSkeleton from "../components/LoadingSkeleton";
import WeatherPanels from "../components/WeatherPanels";
import FavouriteButton from "../components/favouriteButton";
import Favourites from "../components/Favourites";

export default function LocationPage() {
  const { cityName } = useParams();
  const [params] = useSearchParams();
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const valid = params.has("lat") && params.has("lon") &&
    Number.isFinite(lat) && Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  const coords = valid ? { lat, lon } : null;
  const weather = useWeather(coords);
  const forecast = useForecast(coords);
  const country = params.get("country") || "";
  const state = params.get("state") || "";
  const name = cityName || "Selected location";

  return (
    <div className="space-y-5">
      <Favourites />
      <section className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">CITY TRANSMISSION / 002</p>
          <h1 className="page-title">{name}{country ? ", " + country : ""}</h1>
        </div>
        {weather.data && (
          <FavouriteButton state={state} data={{
            ...weather.data, name,
            sys: { ...weather.data.sys, country },
          }} />
        )}
      </section>
      {!valid ? (
        <Alert className="pixel-card"><AlertTitle>Invalid location link</AlertTitle>
          <AlertDescription>Search for a city to open a valid forecast.</AlertDescription>
        </Alert>
      ) : weather.error || forecast.error ? (
        <Alert className="pixel-card"><AlertTitle>Weather signal lost</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{(weather.error || forecast.error)?.message || "Could not load this forecast."}</p>
            <Button className="pixel-button" onClick={() => void Promise.all([weather.refetch(), forecast.refetch()])}>Retry forecast</Button>
          </AlertDescription>
        </Alert>
      ) : !weather.data || !forecast.data ? <LoadingSkeleton /> : (
        <WeatherPanels weather={weather.data} forecast={forecast.data}
          locationName={{ name, country, state, lat, lon, local_names: {} }} />
      )}
    </div>
  );
}
