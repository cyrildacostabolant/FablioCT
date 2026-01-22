function getStopId(name) {
  return GTFS.stops.find(s => s.stop_name === name)?.stop_id;
}

function dayOfWeek(date) {
  return ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][date.getDay()];
}

function serviceRuns(service, date) {
  const d = dateOfGTFS(date);
  if (d < service.start_date || d > service.end_date) return false;
  return service[dayOfWeek(date)] === "1";
}

function dateOfGTFS(date) {
  return date.toISOString().slice(0,10).replace(/-/g,"");
}

function getTrips(from, to, date, time) {
  const fromId = getStopId(from);
  const toId = getStopId(to);
  const results = [];

  GTFS.trips.forEach(trip => {
    const service = GTFS.calendar.find(c => c.service_id === trip.service_id);
    if (!service || !serviceRuns(service, date)) return;

    const times = GTFS.stop_times.filter(t => t.trip_id === trip.trip_id);
    const dep = times.find(t => t.stop_id === fromId);
    const arr = times.find(t => t.stop_id === toId);

    if (dep && arr && dep.departure_time >= time) {
      const route = GTFS.routes.find(r => r.route_id === trip.route_id);
      results.push({
        line: route.route_short_name,
        depart: dep.departure_time,
        arrivee: arr.arrival_time
      });
    }
  });

  return results.sort((a,b)=>a.depart.localeCompare(b.depart)).slice(0,4);
}
