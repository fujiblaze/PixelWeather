import type { Coordinates, Forecast, GeoLocation, Weather, WeatherCondition } from "./types";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const SEARCH_URL = "https://geocoding-api.open-meteo.com/v1/search";

interface ForecastResponse {
  timezone: string;
  current: {
    time: string; temperature_2m: number; apparent_temperature: number;
    relative_humidity_2m: number; surface_pressure: number; weather_code: number;
    wind_speed_10m: number; wind_direction_10m: number; wind_gusts_10m: number;
    is_day: number;
  };
  hourly: {
    time: string[]; temperature_2m: number[]; apparent_temperature: number[];
    relative_humidity_2m: number[]; surface_pressure: number[]; weather_code: number[];
    wind_speed_10m: number[]; wind_direction_10m: number[]; wind_gusts_10m: number[];
  };
  daily: {
    time: string[]; temperature_2m_min: number[]; temperature_2m_max: number[];
    sunrise: string[]; sunset: string[];
  };
}

function timestamp(localTime: string): number {
  return Date.parse(localTime + "Z") / 1000;
}

function condition(code: number, isDay: boolean): WeatherCondition {
  const labels: Record<number, string> = {
    0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle",
    55: "Heavy drizzle", 56: "Freezing drizzle", 57: "Freezing drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain",
    67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
    77: "Snow grains", 80: "Rain showers", 81: "Rain showers",
    82: "Heavy showers", 85: "Snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail",
  };
  const id = code === 0 ? 800 : code === 1 ? 801 : code === 2 ? 802 :
    code === 3 ? 804 : code < 50 ? 741 : code < 60 ? 301 :
    code < 70 ? 501 : code < 80 ? 601 : code < 90 ? 521 : 211;
  const icon = id >= 200 && id < 300 ? "11" : id >= 300 && id < 400 ? "09" :
    id >= 500 && id < 600 ? "10" : id >= 600 && id < 700 ? "13" :
    id >= 700 && id < 800 ? "50" : id === 800 ? "01" :
    id === 801 ? "02" : id === 802 ? "03" : "04";
  return { id, main: labels[code] ?? "Mixed weather", description: labels[code] ?? "Mixed weather", icon: icon + (isDay ? "d" : "n") };
}

async function getJson<T>(url: URL, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Weather service returned " + response.status + ".");
  const json = await response.json();
  if (json.error) throw new Error(json.reason || "Weather service error.");
  return json as T;
}

export const weatherAPI = {
  async getBundle(coords: Coordinates, signal?: AbortSignal): Promise<{ weather: Weather; forecast: Forecast }> {
    const url = new URL(FORECAST_URL);
    url.search = new URLSearchParams({
      latitude: String(coords.lat), longitude: String(coords.lon),
      timezone: "auto", wind_speed_unit: "ms", forecast_days: "6",
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day",
      hourly: "temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
      daily: "temperature_2m_min,temperature_2m_max,sunrise,sunset",
    }).toString();
    const data = await getJson<ForecastResponse>(url, signal);
    const todayIndex = Math.max(0, data.daily.time.indexOf(data.current.time.slice(0, 10)));
    const weather: Weather = {
      coord: coords, name: "Your location", timezone: data.timezone,
      localTime: data.current.time, dt: timestamp(data.current.time),
      weather: [condition(data.current.weather_code, data.current.is_day === 1)],
      main: {
        temp: data.current.temperature_2m, feels_like: data.current.apparent_temperature,
        temp_min: data.daily.temperature_2m_min[todayIndex],
        temp_max: data.daily.temperature_2m_max[todayIndex],
        pressure: data.current.surface_pressure, humidity: data.current.relative_humidity_2m,
      },
      wind: {
        speed: data.current.wind_speed_10m, deg: data.current.wind_direction_10m,
        gust: data.current.wind_gusts_10m,
      },
      sys: {
        country: "", sunrise: timestamp(data.daily.sunrise[todayIndex]),
        sunset: timestamp(data.daily.sunset[todayIndex]),
      },
    };
    const startHour = Math.max(0, data.hourly.time.findIndex((time) => time >= data.current.time.slice(0, 13)));
    const forecast: Forecast = {
      timezone: data.timezone,
      location: { name: weather.name, country: "", sunrise: weather.sys.sunrise, sunset: weather.sys.sunset },
      list: data.hourly.time.slice(startHour).map((time, offset) => {
        const i = startHour + offset;
        const dateIndex = Math.max(0, data.daily.time.indexOf(time.slice(0, 10)));
        return {
          dt: timestamp(time), dt_formatted: time,
          main: {
            temp: data.hourly.temperature_2m[i], feels_like: data.hourly.apparent_temperature[i],
            temp_min: data.daily.temperature_2m_min[dateIndex],
            temp_max: data.daily.temperature_2m_max[dateIndex],
            pressure: data.hourly.surface_pressure[i], humidity: data.hourly.relative_humidity_2m[i],
          },
          weather: [condition(data.hourly.weather_code[i], Number(time.slice(11, 13)) >= 6 && Number(time.slice(11, 13)) < 18)],
          wind: {
            speed: data.hourly.wind_speed_10m[i], deg: data.hourly.wind_direction_10m[i],
            gust: data.hourly.wind_gusts_10m[i],
          },
        };
      }),
    };
    return { weather, forecast };
  },

  async searchLocations(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
    const url = new URL(SEARCH_URL);
    url.search = new URLSearchParams({ name: query.trim(), count: "8", language: "en" }).toString();
    const data = await getJson<{ results?: Array<{ name: string; latitude: number; longitude: number; country_code: string; admin1?: string }> }>(url, signal);
    return (data.results ?? []).map((place) => ({
      name: place.name, lat: place.latitude, lon: place.longitude,
      country: place.country_code, state: place.admin1, local_names: {},
    }));
  },
};
