import re
import glob

old_btn = r'<button\s*onClick={onClose}\s*className="absolute top-4 right-4 z-20 p-2 rounded-full bg-bg-inset/80 hover:bg-bg-inset text-text-primary border border-border-primary transition-all backdrop-blur-md"\s*>'

new_btn = """<button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-md shadow-lg"
        >"""

for filepath in glob.glob('src/components/*Modal.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = re.sub(old_btn, new_btn, content)
    
    with open(filepath, 'w') as f:
        f.write(content)

