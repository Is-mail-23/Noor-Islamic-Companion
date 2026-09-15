import re
import glob

wrapper_start = r'<div className="fixed inset-0 z-\[9999\][^>]*>\s*<div className="relative w-full max-w-[^"]* bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl[^"]*">'

def replace_wrapper(match):
    full_str = match.group(0)
    # Extract max-w class
    max_w = re.search(r'max-w-[a-zA-Z0-9]+', full_str)
    max_w_cls = max_w.group(0) if max_w else "max-w-2xl"
    
    return f"""<div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full {max_w_cls} bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl">"""

for filepath in glob.glob('src/components/*Modal.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Fix Modal Wrapper
    content = re.sub(wrapper_start, replace_wrapper, content)
    
    # We need to add an extra closing </div> before the final return closing tag
    # But wait, it's easier if we just match the ending. Let's do it carefully.
    
    with open(filepath, 'w') as f:
        f.write(content)

