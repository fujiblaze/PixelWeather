export function formatClock(localTime: string): string {
  const hour = Number(localTime.slice(11, 13));
  const minute = localTime.slice(14, 16);
  return String(hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
}

export function formatUtcClock(timestamp: number): string {
  return formatClock(new Date(timestamp * 1000).toISOString());
}

export function formatDay(localDate: string): string {
  const [year, month, day] = localDate.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    weekday: "long", month: "short", day: "numeric", timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
