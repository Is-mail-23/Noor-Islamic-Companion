import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

content = content.replace("""    // Pan map to mosque and open popup
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([mosque.lat, mosque.lng], 16, { animate: true });
    }
    const marker = mosqueMarkersMapRef.current.get(mosque.id);
    if (marker) {
      marker.openPopup();
    }""", """    // Open popup, which will trigger the offset panning automatically
    const marker = mosqueMarkersMapRef.current.get(mosque.id);
    if (marker) {
      marker.openPopup();
    }""")

content = content.replace("""  const panToMosque = (m: Mosque) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([m.lat, m.lng], 16, { animate: true });
    }
    const marker = mosqueMarkersMapRef.current.get(m.id);
    if (marker) {
      marker.openPopup();
    }
  };""", """  const panToMosque = (m: Mosque) => {
    const marker = mosqueMarkersMapRef.current.get(m.id);
    if (marker) {
      marker.openPopup();
    }
  };""")

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)

