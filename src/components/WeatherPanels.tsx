import { useEffect } from "react";
import type { Forecast, GeoLocation, Weather } from "../api/types";
import { weatherScene } from "../lib/weatherScene";
import CurrentWeather from "./CurrentWeather";
import HourlyTemp from "./HourlyTemp";
import Details from "./Details";
import ForecastCard from "./Forecast";

interface Props {
  weather: Weather;
  forecast: Forecast;
  locationName?: GeoLocation;
}

export default function WeatherPanels({ weather, forecast, locationName }: Props) {
  useEffect(() => {
    document.documentElement.dataset.weatherScene = weatherScene(weather.weather[0].id, weather.weather[0].icon);
  }, [weather]);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4">
        <CurrentWeather data={weather} locationName={locationName} />
        <HourlyTemp data={forecast} />
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Details data={weather} />
        <ForecastCard data={forecast} />
      </div>
    </section>
  );
}
