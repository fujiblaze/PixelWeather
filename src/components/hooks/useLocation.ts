import { useCallback, useEffect, useRef, useState } from "react";
import type { Coordinates } from "../../api/types";

interface LocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

export function useLocation() {
  const requestId = useRef(0);
  const [locationData, setLocationData] = useState<LocationState>({
    coordinates: null, error: null, isLoading: true,
  });

  const getLocation = useCallback(() => {
    const id = ++requestId.current;
    setLocationData((previous) => ({ ...previous, isLoading: true, error: null }));
    if (!navigator.geolocation) {
      setLocationData({ coordinates: null, error: "This browser does not support location access. Search for a city instead.", isLoading: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (id !== requestId.current) return;
        setLocationData({
          coordinates: { lat: position.coords.latitude, lon: position.coords.longitude },
          error: null, isLoading: false,
        });
      },
      (error) => {
        if (id !== requestId.current) return;
        const message = error.code === error.PERMISSION_DENIED
          ? "Location access is off. Enable it in your browser, or search for a city."
          : error.code === error.TIMEOUT
            ? "Finding your location timed out. Try again or search for a city."
            : "Your location is unavailable. Try again or search for a city.";
        setLocationData((previous) => ({ coordinates: previous.coordinates, error: message, isLoading: false }));
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  useEffect(() => {
    getLocation();
    return () => { requestId.current += 1; };
  }, [getLocation]);

  return { ...locationData, getLocation };
}
