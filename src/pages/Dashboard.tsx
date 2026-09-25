import { useLocation } from "../components/hooks/useLocation";
import { useForecast, useWeather } from "../components/hooks/useWeather";
import { Button } from "../components/ui/button";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { MapPin, RefreshCw } from "lucide-react";
import WeatherPanels from "../components/WeatherPanels";
import Favourites from "../components/Favourites";

export default function Dashboard() {
  const { coordinates, error: locationError, getLocation, isLoading } = useLocation();
  const weather = useWeather(coordinates);
  const forecast = useForecast(coordinates);
  const refresh = () => { void Promise.all([weather.refetch(), forecast.refetch()]); };

  return (
    <div className="space-y-5">
      <Favourites />
      <section className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">LOCAL TRANSMISSION / 001</p>
          <h1 className="page-title">Current location</h1>
        </div>
        {coordinates && (
          <Button variant="outline" size="icon" onClick={refresh} disabled={weather.isFetching}
            className="pixel-button size-12" aria-label="Refresh weather">
            <RefreshCw className={weather.isFetching ? "size-5 pixel-step-spin" : "size-5"} />
          </Button>
        )}
      </section>
      {isLoading && !coordinates ? <LoadingSkeleton /> : !coordinates ? (
        <Alert className="pixel-card">
          <MapPin className="size-5" />
          <AlertTitle>Location signal unavailable</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{locationError || "Allow location access to see weather nearby, or search for a city above."}</p>
            <Button onClick={getLocation} className="pixel-button">Try location again</Button>
          </AlertDescription>
        </Alert>
      ) : weather.error || forecast.error ? (
        <Alert className="pixel-card">
          <AlertTitle>Weather signal lost</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{(weather.error || forecast.error)?.message || "Could not load the forecast."}</p>
            <Button onClick={refresh} className="pixel-button">Retry forecast</Button>
          </AlertDescription>
        </Alert>
      ) : !weather.data || !forecast.data ? <LoadingSkeleton /> : (
        <>
          {locationError && <p className="status-note">{locationError} Showing the last known location.</p>}
          <WeatherPanels weather={weather.data} forecast={forecast.data} />
        </>
      )}
    </div>
  );
}
