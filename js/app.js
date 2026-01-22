function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.style.display="none");
  document.getElementById(id).style.display="block";
}

function table(trips) {
  if (!trips.length) return "<p>Aucun trajet trouvé</p>";

  let h = "<table><tr><th>Ligne</th><th>Départ</th><th>Arrivée</th></tr>";
  trips.forEach(t => {
    h += `
    <tr>
      <td class="line"><img src="assets/lines/${t.line}.png">${t.line}</td>
      <td>${t.depart}</td>
      <td>${t.arrivee}</td>
    </tr>`;
  });
  return h + "</table>";
}

async function init() {
  await loadGTFS();

  const today = new Date();
  const now = today.toTimeString().slice(0,8);

  document.getElementById("mamie").innerHTML =
    "<h3>GARE SNCF → OTMUS</h3>" +
    table(getTrips("GARE SNCF","OTMUS",today,now));

  document.getElementById("gare").innerHTML =
    "<h3>J.JAURES → GARE SNCF</h3>" +
    table(getTrips("J.JAURES","GARE SNCF",today,now));

  const stops = GTFS.stops.map(s=>s.stop_name).sort();
  document.getElementById("search").innerHTML = `
    <h3>Recherche personnalisée</h3>
    <form id="f">
      <select id="from">${stops.map(s=>`<option>${s}</option>`).join("")}</select>
      <select id="to">${stops.map(s=>`<option>${s}</option>`).join("")}</select>
      <input type="date" id="date" value="${today.toISOString().slice(0,10)}">
      <input type="time" id="time" value="${now.slice(0,5)}">
      <button>Rechercher</button>
    </form>
    <div id="res"></div>`;

  document.getElementById("f").onsubmit = e => {
    e.preventDefault();
    const d = new Date(date.value);
    res.innerHTML = table(getTrips(from.value,to.value,d,time.value+":00"));
  };

  showTab("mamie");
}

init();
