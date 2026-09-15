import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

content = content.replace("""    const handleSelectMosqueTimes = (mosque: Mosque) => {
    
    // Open popup, which will trigger the offset panning automatically
    const marker = mosqueMarkersMapRef.current.get(mosque.id);
    if (marker) {
      marker.openPopup();
    }
  };""", """    const handleSelectMosqueTimes = (mosque: Mosque) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([mosque.lat, mosque.lng], { animate: true });
    }
    onSelectMosque(mosque);
  };""")

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)
