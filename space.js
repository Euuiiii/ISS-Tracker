const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const icon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 32],
  iconAnchor: [25, 16]
});

const marker = L.marker([0, 0], { icon }).addTo(map);

async function getISS() {
  const res = await fetch('http://api.open-notify.org/iss-now.json');
  const data = await res.json();
  const { latitude, longitude } = data.iss_position;

  document.getElementById('lat').textContent = latitude;
  document.getElementById('lon').textContent = longitude;

  marker.setLatLng([latitude, longitude]);
  map.setView([latitude, longitude], map.getZoom());
}

getISS();
setInterval(getISS, 2000);
