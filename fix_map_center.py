import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

# Replace autoPan: false with true
content = content.replace("marker.bindPopup(popupDiv, { maxWidth: 300, autoPan: false });", "marker.bindPopup(popupDiv, { maxWidth: 300, autoPan: true });")

# Remove the popupopen map.panTo logic
content = re.sub(
    r"if \(mapInstanceRef\.current\) \{\s*const map = mapInstanceRef\.current;\s*// Calculate an offset.*?map\.panTo\(offsetLatLng, \{ animate: true \}\);\s*\}",
    "",
    content,
    flags=re.DOTALL
)

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)
