export type Coordinates = { lat: number; lon: number };

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Weather {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number; gust: number };
  sys: { country: string; sunrise: number; sunset: number };
  name: string;
  dt: number;
  timezone: string;
  localTime: string;
}

export interface Forecast {
  list: Array<{
    dt: number;
    main: Weather["main"];
    weather: Weather["weather"];
    wind: Weather["wind"];
    dt_formatted: string;
  }>;
  location: { name: string; country: string; sunrise: number; sunset: number };
  timezone: string;
}

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  local_names: Record<string, string>;
  country: string;
  state?: string;
}
