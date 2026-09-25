import { useLocalStorage } from "./useLocalStorage";

export interface FavouriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavourites() {
  const [stored, setFavourites] = useLocalStorage<FavouriteCity[]>("favourites", []);
  const favourites = Array.isArray(stored) ? stored : [];

  const addFavourite = {
    mutate: (city: Omit<FavouriteCity, "id" | "addedAt">) => {
      setFavourites((previous) => {
        const current = Array.isArray(previous) ? previous : [];
        const id = city.lat + "-" + city.lon;
        if (current.some((item) => item.id === id)) return current;
        return [{ ...city, id, addedAt: Date.now() }, ...current].slice(0, 10);
      });
    },
  };
  const removeFavourites = {
    mutate: (id: string) => setFavourites((previous) =>
      (Array.isArray(previous) ? previous : []).filter((city) => city.id !== id)),
  };

  return {
    favourites, addFavourite, removeFavourites,
    isFavourite: (lat: number, lon: number) =>
      favourites.some((city) => city.lat === lat && city.lon === lon),
  };
}
