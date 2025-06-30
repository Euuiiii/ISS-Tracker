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

//circle around circle
let issCircle = L.circle([0, 0], {
  radius: 2200000,
  color: 'light blue',
  fillColor: '#30f',
  fillOpacity: 0.2
}).addTo(map);


let issPathCoords = [];
let issPathLine = L.polyline([], { color: 'orange', weight: 2 }).addTo(map);

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
    const { latitude, longitude, footprint } = data;

    console.log('ISS position:', latitude, longitude);

    document.getElementById('lat').textContent = latitude.toFixed(2);
    document.getElementById('lon').textContent = longitude.toFixed(2);

    marker.setLatLng([latitude, longitude]);

    // Update circle
    issCircle.setLatLng([latitude, longitude]);
    if (footprint) {
      issCircle.setRadius((footprint * 1000) / 2);
    }

    // Update path ( i think i will remove this later)
    issPathCoords.push([latitude, longitude]);
    if (issPathCoords.length > 1000) issPathCoords.shift(); 
    issPathLine.setLatLngs(issPathCoords);

    if (followISS) {
      map.setView([latitude, longitude], map.getZoom());
    }
  } catch (error) {
    console.error('Failed to fetch ISS position:', error);
  }
}

getISS();
setInterval(getISS, 1000);

const view3DButton = document.getElementById('view3D');
const globeFrame = document.getElementById('globeFrame');
const mapDiv = document.getElementById('map');
const infoP = document.querySelector('p');

view3DButton.addEventListener('click', () => {
  mapDiv.style.display = 'none';
  followBtn.style.display = 'none';
  infoP.style.display = 'none';
  globeFrame.style.display = 'block';
  view3DButton.style.display = 'none';
  
  // This is trash after video and audio is removed
  document.getElementById('bg-video').pause();
  document.getElementById('bg-video').style.display = 'none';
  document.getElementById('space-audio').pause();
  document.getElementById('space-audio').style.display = 'none';
  window.location.href = '3D_Earth/earth.html';
});
