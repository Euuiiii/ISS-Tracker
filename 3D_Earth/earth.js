document.addEventListener('DOMContentLoaded', function () {
  const Globe = window.Globe;
  const globeContainer = document.getElementById('globeViz');

  const globe = Globe()(globeContainer)
    .globeImageUrl('https://unpkg.com/three-globe@latest/example/img/earth-blue-marble.jpg')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png');

  const issIconUrl = 'https://i.ibb.co/ZYW3VTp/ISS-icon.png'; // not working (it cooked me)
  let issMarker = { lat: 0, lng: 0 };

  const loader = new window.THREE.TextureLoader();
  loader.load(issIconUrl, (texture) => {
    const material = new window.THREE.SpriteMaterial({ map: texture, transparent: true });

    globe
      .customLayerData([issMarker])
      .customThreeObject(() => {
        const sprite = new window.THREE.Sprite(material);
        sprite.scale.set(20, 12, 1);
        return sprite;
      })
      .customThreeObjectUpdate(() => {});

    async function updateISS() {
      const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const data = await res.json();
      issMarker.lat = data.latitude;
      issMarker.lng = data.longitude;
      globe.customLayerData([Object.assign({}, issMarker)]);
    }

    updateISS();
    setInterval(updateISS, 1000);
  });
});
