import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

content = content.replace("""  const panToMosque = (m: Mosque) => {
    const marker = mosqueMarkersMapRef.current.get(m.id);
    if (marker) {
      marker.openPopup();
    }
  };""", """  const panToMosque = (m: Mosque) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([m.lat, m.lng], { animate: true });
    }
    onSelectMosque(m);
  };""")

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)
