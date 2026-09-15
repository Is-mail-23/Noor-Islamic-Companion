import re

with open('src/components/MasjidMap.tsx', 'r') as f:
    content = f.read()

# Remove handleSelectMosqueTimes scrolling logic
# The easiest way is to modify handleSelectMosqueTimes
handle_times_start = content.find("const handleSelectMosqueTimes = (mosque: Mosque) => {")
if handle_times_start != -1:
    handle_times_end = content.find("  };", handle_times_start) + 4
    new_handle_times = """  const handleSelectMosqueTimes = (mosque: Mosque) => {
    setSelectedMosqueForTimes(mosque);
    // Pan map to mosque and open popup
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([mosque.lat, mosque.lng], 16, { animate: true });
    }
    const marker = mosqueMarkersMapRef.current.get(mosque.id);
    if (marker) {
      marker.openPopup();
    }
  };"""
    content = content[:handle_times_start] + new_handle_times + content[handle_times_end:]

# Remove the active-masjid-times-panel JSX block
# Start: {/* IMPORTANT USER REQUIREMENT:
panel_start = content.find('{/* \n        IMPORTANT USER REQUIREMENT:\n        "show the list of times, only when clicked on an maszid icon"\n      */}')
if panel_start == -1:
    panel_start = content.find('{/* \n        IMPORTANT USER REQUIREMENT:')
    
if panel_start != -1:
    # Find the end of this block
    # It ends with `      )}` just before `    </div>` for the main wrapper.
    # The last div ends at the end of the file. Let's find the `    </div>\n  );\n};\n`
    panel_end = content.rfind('</div>\n  );\n};')
    # Actually, it's safer to just remove the conditional block `selectedMosqueForTimes ? (...) : null`
    # Let's just truncate from panel_start to the `</div>\n  );\n};` and append `</div>\n  );\n};\n`
    content = content[:panel_start] + '\n  );\n};\n'

with open('src/components/MasjidMap.tsx', 'w') as f:
    f.write(content)

