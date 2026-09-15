import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

new_handlers = """      marker.on('popupopen', () => {
        if (mapInstanceRef.current) {
          // Calculate an offset to put the POPUP in the exact center (not just the marker)
          // The popup is about 300px tall. So panning slightly above the marker is better, 
          // or just pan to the marker for now.
          mapInstanceRef.current.panTo([mosque.lat, mosque.lng], { animate: true });
        }
        const viewBtn = document.getElementById(`view-profile-${mosque.id}`);"""

content = content.replace("""      marker.on('popupopen', () => {
        
        const viewBtn = document.getElementById(`view-profile-${mosque.id}`);""", new_handlers)

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)

