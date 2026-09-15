import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

# Make sure popup opens on contextmenu (long press)
if "marker.on('contextmenu'" not in content:
    content = content.replace("marker.on('click', () => {", 
    "marker.on('contextmenu', () => { marker.openPopup(); setSelectedMosqueForTimes(mosque); });\n      marker.on('click', () => {")

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)

