import re
import glob

for filepath in glob.glob('src/components/*Modal.tsx'):
    if "AuthModal" in filepath or "SettingsModal" in filepath:
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()

    open_count = len(re.findall(r'<div\b[^>]*>', content))
    close_count = len(re.findall(r'</div\s*>', content))
    
    if open_count > close_count:
        missing = open_count - close_count
        print(f"{filepath} is missing {missing} closing divs")
        content = re.sub(r'\);\s*};\s*$', ('</div>\n' * missing) + ');\n};\n', content)
        with open(filepath, 'w') as f:
            f.write(content)
    elif close_count > open_count:
        excess = close_count - open_count
        print(f"{filepath} has {excess} excess closing divs")
        # Let's remove excess divs from the end
        for _ in range(excess):
            content = re.sub(r'</div>\s*(\);\s*};\s*)$', r'\1', content)
        with open(filepath, 'w') as f:
            f.write(content)

