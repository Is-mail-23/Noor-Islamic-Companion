import re

with open('src/components/TasbeehCounter.tsx', 'r') as f:
    content = f.read()

# 1. Add FATIMAH_PACKAGE_ID constant and Zikr Packages logic
if 'FATIMAH_PACKAGE_ID' not in content:
    # insert after ZIKR_PRESETS import
    content = content.replace("import { ZIKR_PRESETS } from '../data/zikrAndDuasData';", 
    "import { ZIKR_PRESETS, ZikrItem } from '../data/zikrAndDuasData';\n\nconst FATIMAH_PACKAGE_ID = 'tasbeeh-e-fatima';\nconst FATIMAH_PACKAGE: ZikrItem = {\n  id: FATIMAH_PACKAGE_ID,\n  arabic: 'سُبْحَانَ ٱللَّٰهِ • ٱلْحَمْدُ لِلَّٰهِ • ٱللَّٰهُ أَكْبَرُ',\n  transliteration: 'Tasbeeh-e-Fatima (Package)',\n  translation: 'Subhanallah (33), Alhamdulillah (33), Allahu Akbar (34)',\n  meaning: 'The remembrance taught by the Prophet (PBUH) to his daughter Fatimah.',\n  defaultTarget: 100,\n};")
    
    # replace useState for selectedZikr to include ZikrItem type properly
    # (already there, just add logic for active Zikr display)
    
    # We will compute `activeDisplayZikr` based on `count` and `selectedZikr`
    # Let's insert it right before `// Bead colors`
    active_zikr_hook = """
  const activeDisplayZikr = React.useMemo(() => {
    if (selectedZikr.id === FATIMAH_PACKAGE_ID) {
      if (count < 33) return ZIKR_PRESETS[0];
      if (count < 66) return ZIKR_PRESETS[1];
      return ZIKR_PRESETS[2];
    }
    return selectedZikr;
  }, [selectedZikr, count]);
"""
    content = content.replace("// Bead colors", active_zikr_hook + "\n  // Bead colors")

    # update the display from selectedZikr to activeDisplayZikr
    content = content.replace("selectedZikr.arabic", "activeDisplayZikr.arabic")
    content = content.replace("selectedZikr.transliteration", "activeDisplayZikr.transliteration")
    content = content.replace("selectedZikr.translation", "activeDisplayZikr.translation")
    content = content.replace("selectedZikr.virtue", "activeDisplayZikr.virtue")
    
    # Add Fatimah package to the Zikr options
    # The first 3 Zikrs are ZIKR_PRESETS.slice(0,3)
    # We will add Fatimah package as a special button

with open('src/components/TasbeehCounter.tsx', 'w') as f:
    f.write(content)

