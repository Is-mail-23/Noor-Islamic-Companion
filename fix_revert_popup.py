import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

replacement = """      // Create popup content showing list of times when clicked
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1 text-text-primary max-w-[280px]';
      popupDiv.innerHTML = `
        <div class="relative h-24 w-full rounded-lg overflow-hidden mb-2 bg-bg-inset">
          <img src="${mosque.coverImage}" alt="${escapeHtml(mosque.name)}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent"></div>
          <span class="absolute bottom-1 left-2 text-[10px] font-semibold text-[#c6a55e] bg-bg-inset/90 px-2 py-0.5 rounded-md border border-border-primary">
            ${distanceText ? \`📍 ${distanceText}\` : '5 Waqt Times'}
          </span>
        </div>
        <h4 class="font-bold text-sm text-text-primary leading-snug line-clamp-1 font-serif-title">${escapeHtml(mosque.name)}</h4>
        <p class="text-[11px] text-text-secondary line-clamp-1 mb-2">📍 ${escapeHtml(mosque.address)}</p>
        
        <!-- 5 Waqt Times List in Popup -->
        <div class="bg-bg-inset p-2 rounded-lg border border-border-primary text-[11px] space-y-1 mb-2.5">
          <div class="flex justify-between text-text-secondary">
            <span>Fajr: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.fajr.iqamah}</b></span>
            <span>Dhuhr: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.dhuhr.iqamah}</b></span>
          </div>
          <div class="flex justify-between text-text-secondary">
            <span>Asr: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.asr.iqamah}</b></span>
            <span>Maghrib: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.maghrib.iqamah}</b></span>
          </div>
          <div class="flex justify-between text-text-secondary">
            <span>Isha: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.isha.iqamah}</b></span>
            <span>Jummah: <b class="text-[#c6a55e] font-mono">${mosque.prayerTimes.jummah?.iqamah || '01:30 PM'}</b></span>
          </div>
        </div>

        <div class="text-[11px] text-text-secondary mb-2">
          <span>Muazzin: <b class="text-text-primary">${escapeHtml(mosque.muazzinName)}</b></span>
          <br/>
          <span>Admin: <b class="text-text-primary">${escapeHtml(mosque.adminName)}</b></span>
        </div>

        <div class="grid grid-cols-2 gap-1.5">
          <button id="view-profile-${mosque.id}" class="w-full py-1.5 px-2 bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary rounded-lg text-xs font-bold text-center transition-colors">
            View Profile
          </button>
          <button id="admin-login-${mosque.id}" class="w-full py-1.5 px-2 bg-[#1c222a] hover:bg-[#252c36] text-[#c6a55e] border border-border-primary rounded-lg text-xs font-semibold text-center transition-colors">
            Admin Portal
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv, { maxWidth: 300, autoPan: false });

      marker.on('contextmenu', () => { marker.openPopup(); });

      marker.on('popupopen', () => {
        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          // Calculate an offset to put the POPUP in the exact center (not just the marker)
          // The popup is roughly 240px tall. By shifting the pan target up by 120 pixels, 
          // the popup itself becomes perfectly centered on the screen.
          const targetPoint = map.project([mosque.lat, mosque.lng], map.getZoom()).subtract([0, 120]);
          const offsetLatLng = map.unproject(targetPoint, map.getZoom());
          map.panTo(offsetLatLng, { animate: true });
        }
        
        const viewBtn = document.getElementById(`view-profile-${mosque.id}`);
        const adminBtn = document.getElementById(`admin-login-${mosque.id}`);

        if (viewBtn) {
          viewBtn.onclick = () => onSelectMosque(mosque);
        }
        if (adminBtn) {
          adminBtn.onclick = () => onOpenAdmin(mosque);
        }
      });
      
      markersGroup.addLayer(marker);"""

# The chunk to replace is from `// When marker is clicked` down to `markersGroup.addLayer(marker);`

content = re.sub(
    r"      // When marker is clicked, directly open the Profile Modal instead of ugly leaflet popups.*?markersGroup\.addLayer\(marker\);",
    replacement.replace('\\', '\\\\'),
    content,
    flags=re.DOTALL
)

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)

