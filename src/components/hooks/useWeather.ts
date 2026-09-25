import type { Coordinates } from "../../api/types";
import { weatherAPI } from "../../api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
  bundle: (coords: Coordinates | null) => ["weather", coords?.lat, coords?.lon] as const,
  search: (query: string) => ["search", query] as const,
};

export function useWeather(coords: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.bundle(coords),
    queryFn: ({ signal }) => weatherAPI.getBundle(coords!, signal),
    select: (bundle) => bundle.weather,
    enabled: coords !== null && Number.isFinite(coords.lat) && Number.isFinite(coords.lon),
  });
}

export function useForecast(coords: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.bundle(coords),
    queryFn: ({ signal }) => weatherAPI.getBundle(coords!, signal),
    select: (bundle) => bundle.forecast,
    enabled: coords !== null && Number.isFinite(coords.lat) && Number.isFinite(coords.lon),
  });
}

export function useSearchLocations(query: string) {
  const normalized = query.trim();
  return useQuery({
    queryKey: WEATHER_KEYS.search(normalized),
    queryFn: ({ signal }) => weatherAPI.searchLocations(normalized, signal),
    enabled: normalized.length >= 2,
    staleTime: 1000 * 60 * 30,
  });
}
