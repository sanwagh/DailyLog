export function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function todayISODate() {
  return toISODate(new Date());
}

export function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function defaultRange() {
  const end = todayISODate();
  const start = addDays(end, -29);
  return { start, end };
}

export function formatDayMonth(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

export function formatYear(isoDate) {
  return isoDate.slice(0, 4);
}

export function formatWeekday(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-GB", { weekday: "long" });
}
