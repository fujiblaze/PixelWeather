import type { Weather } from "../api/types";
import { useFavourites } from "./hooks/useFavourites";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function FavouriteButton({ data, state }: { data: Weather; state?: string }) {
  const { addFavourite, isFavourite, removeFavourites } = useFavourites();
  const selected = isFavourite(data.coord.lat, data.coord.lon);
  const toggle = () => {
    if (selected) {
      removeFavourites.mutate(data.coord.lat + "-" + data.coord.lon);
      toast.message(data.name + " removed from favourites.");
    } else {
      addFavourite.mutate({
        name: data.name, lat: data.coord.lat, lon: data.coord.lon, country: data.sys.country, state,
      });
      toast.success(data.name + " saved to favourites.");
    }
  };
  return <Button variant="outline" size="icon" className="pixel-button size-12" onClick={toggle}
    aria-label={selected ? "Remove from favourites" : "Add to favourites"} aria-pressed={selected}>
    <Heart className="size-5" fill={selected ? "currentColor" : "none"} />
  </Button>;
}
