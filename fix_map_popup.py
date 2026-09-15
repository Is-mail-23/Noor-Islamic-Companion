import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

# We need to remove the popupDiv creation and bindPopup, and change marker handlers.

# The block to remove is from `const popupDiv = document.createElement('div');` down to `marker.bindPopup(popupDiv, { maxWidth: 300, autoPan: false });`
# Then we change the handlers.

def replace_logic(match):
    return """      // When marker is clicked, directly open the Profile Modal instead of ugly leaflet popups
      marker.on('click', () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([mosque.lat, mosque.lng], { animate: true });
        }
        onSelectMosque(mosque);
      });
      marker.on('contextmenu', () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([mosque.lat, mosque.lng], { animate: true });
        }
        onSelectMosque(mosque);
      });"""

# Use regex to find the popup logic and replace it
new_content = re.sub(
    r"      // Create popup content showing list of times when clicked.*?marker\.on\('popupopen', \(\) => \{.*?if \(adminBtn\) \{\s*adminBtn\.onclick = \(\) => onOpenAdmin\(mosque\);\s*\}\s*\}\);\s*",
    replace_logic,
    content,
    flags=re.DOTALL
)

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(new_content)

