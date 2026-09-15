import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

new_logic = """      marker.on('popupopen', () => {
        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          // Calculate an offset to put the POPUP in the exact center (not just the marker)
          // The popup is roughly 240px tall. By shifting the pan target up by 120 pixels, 
          // the popup itself becomes perfectly centered on the screen.
          const targetPoint = map.project([mosque.lat, mosque.lng], map.getZoom()).subtract([0, 120]);
          const offsetLatLng = map.unproject(targetPoint, map.getZoom());
          map.panTo(offsetLatLng, { animate: true });
        }"""

content = re.sub(
    r"      marker\.on\('popupopen', \(\) => \{\n        if \(mapInstanceRef\.current\) \{.*?\n        \}",
    new_logic,
    content,
    flags=re.DOTALL
)

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)
