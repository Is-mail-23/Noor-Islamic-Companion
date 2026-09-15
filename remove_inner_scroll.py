import re
import glob

for filepath in glob.glob('src/components/*Modal.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove max-h and overflow-y-auto from inner form/div
    content = content.replace('max-h-[75vh] overflow-y-auto', '')
    content = content.replace('max-h-[70vh] overflow-y-auto', '')
    content = content.replace('max-h-[80vh] overflow-y-auto', '')
    
    with open(filepath, 'w') as f:
        f.write(content)
