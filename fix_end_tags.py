import re
import glob

for filepath in glob.glob('src/components/*Modal.tsx'):
    if "AuthModal" in filepath or "SettingsModal" in filepath:
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()

    # Normalize the end
    # Find the last </form> or </div> before the end, and just forcefully make it correct.
    # It's easier: just replace any sequence of `</div>` and `);` at the end with exactly three `</div>`.
    
    content = re.sub(r'(</div>\s*)+\);\s*};\s*$', '</div>\n      </div>\n    </div>\n  );\n};\n', content)

    with open(filepath, 'w') as f:
        f.write(content)
