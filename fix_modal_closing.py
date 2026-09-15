import re
import glob

for filepath in glob.glob('src/components/*Modal.tsx'):
    if "AuthModal" in filepath or "SettingsModal" in filepath:
        continue # AuthModal and SettingsModal were written manually correctly and fix_settings_modal.py was specific

    with open(filepath, 'r') as f:
        content = f.read()
    
    # We need to make sure the end of the return statement has three closing divs.
    # We can match `</div>\n    </div>\n  );\n};` or whatever is at the bottom.
    
    # Just grab the last occurrence of return ( ... );
    # Actually, a regex replacement from bottom:
    
    # Let's count the number of opening and closing divs inside the return block.
    # To be safe, let's just forcefully replace the end of the file.
    
    if "MasjidProfileModal" in filepath or "AllocateMasjidModal" in filepath or "MasjidAdminModal" in filepath:
        # replace the last "</div>\n    </div>\n  );\n};" with "</div>\n      </div>\n    </div>\n  );\n};"
        # Since I'm not sure what it is exactly, let's just do a regex replace on the closing block
        content = re.sub(r'</div>\s*</div>\s*\);\s*\};\s*$', '</div>\n      </div>\n    </div>\n  );\n};\n', content)
        
        with open(filepath, 'w') as f:
            f.write(content)

