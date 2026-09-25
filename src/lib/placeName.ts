export function formatPlaceName(name: string, state?: string) {
  const city = name.trim();
  const region = state?.trim();
  return region && city.localeCompare(region, undefined, { sensitivity: "base" }) !== 0
    ? `${city}, ${region}`
    : city;
}
