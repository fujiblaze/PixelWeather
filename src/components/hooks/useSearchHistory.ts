import { useLocalStorage } from "./useLocalStorage";

export interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function useSearchHistory() {
  const [stored, setHistory] = useLocalStorage<SearchHistoryItem[]>("search-history", []);
  const history = Array.isArray(stored) ? stored : [];
  return {
    history,
    addHistory: {
      mutate: (search: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
        setHistory((previous) => {
          const current = Array.isArray(previous) ? previous : [];
          const item: SearchHistoryItem = {
            ...search, id: search.lat + "-" + search.lon, searchedAt: Date.now(),
          };
          return [item, ...current.filter((old) => old.id !== item.id)].slice(0, 10);
        });
      },
    },
    removeHistory: { mutate: () => setHistory([]) },
  };
}
