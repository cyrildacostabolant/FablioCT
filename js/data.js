async function loadCSV(path) {
  const res = await fetch(path);
  const text = await res.text();
  const [header, ...lines] = text.trim().split("\n");
  const keys = header.split(",");

  return lines.map(l => {
    const values = l.split(",");
    return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
  });
}

const GTFS = {};

async function loadGTFS() {
  GTFS.routes = await loadCSV("data/routes.txt");
  GTFS.stops = await loadCSV("data/stops.txt");
  GTFS.trips = await loadCSV("data/trips.txt");
  GTFS.stop_times = await loadCSV("data/stop_times.txt");
  GTFS.calendar = await loadCSV("data/calendar.txt");
  GTFS.calendar_dates = await loadCSV("data/calendar_dates.txt");
}
