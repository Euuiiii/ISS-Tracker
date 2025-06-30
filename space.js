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

let followISS = true;
const followBtn = document.getElementById('followToggle');

followBtn.textContent = followISS ? 'Unfollow' : 'Follow ISS';

followBtn.addEventListener('click', function () {
  followISS = !followISS;
  followBtn.textContent = followISS ? 'Unfollow' : 'Follow ISS';
});

async function getISS() {
  try {
    const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    const { latitude, longitude } = data;

    console.log('ISS position:', latitude, longitude);

    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('lon').textContent = longitude.toFixed(2);

    marker.setLatLng([latitude, longitude]);

    if (followISS) {
      map.setView([latitude, longitude], map.getZoom());
    }
  } catch (error) {
    console.error('Failed to fetch ISS position:', error);
  }
}

getISS();
setInterval(getISS, 1000);
