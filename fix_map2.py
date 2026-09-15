import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

# Replace bindPopup to include autoPan: false
content = content.replace(
    "marker.bindPopup(popupDiv, { maxWidth: 300 });",
    "marker.bindPopup(popupDiv, { maxWidth: 300, autoPan: false });"
)

# Replace the marker click handlers to be cleaner
old_handlers = """      // When marker is clicked, trigger showing prayer times schedule
      marker.on('contextmenu', () => { marker.openPopup(); setSelectedMosqueForTimes(mosque); });
      marker.on('click', () => {
        setSelectedMosqueForTimes(mosque);
      });
      marker.on('popupopen', () => {
        setSelectedMosqueForTimes(mosque);
        const viewBtn = document.getElementById(`view-profile-${mosque.id}`);
        const adminBtn = document.getElementById(`admin-login-${mosque.id}`);
        if (viewBtn) {
          viewBtn.onclick = () => onSelectMosque(mosque);
        }
        if (adminBtn) {
          adminBtn.onclick = () => onOpenAdmin(mosque);
        }
      });"""

new_handlers = """      // When marker is long-pressed (contextmenu) or clicked, popup opens
      marker.on('contextmenu', () => { marker.openPopup(); });
      marker.on('popupopen', () => {
        const viewBtn = document.getElementById(`view-profile-${mosque.id}`);
        const adminBtn = document.getElementById(`admin-login-${mosque.id}`);
        if (viewBtn) {
          viewBtn.onclick = () => onSelectMosque(mosque);
        }
        if (adminBtn) {
          adminBtn.onclick = () => onOpenAdmin(mosque);
        }
      });"""

content = content.replace(old_handlers, new_handlers)

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)

