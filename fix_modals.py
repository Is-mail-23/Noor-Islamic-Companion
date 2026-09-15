import re
import glob

def fix_modal(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace the wrapper classes to prevent top cut-off on scroll
    # From: className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
    # To: className="fixed inset-0 z-[9999] flex flex-col items-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-fadeIn"
    content = re.sub(
        r'className="fixed inset-0 z-\[9999\] flex items-center justify-center[^"]*overflow-y-auto[^"]*"',
        'className="fixed inset-0 z-[9999] flex flex-col items-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-fadeIn"',
        content
    )

    # For the inner container, change `my-8` to `my-auto shrink-0` so it centers if small but scrolls if big
    # From: className="relative w-full max-w-2xl bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl my-8"
    # To: className="relative w-full max-w-2xl bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl my-auto shrink-0"
    content = re.sub(
        r'className="relative w-full max-w-[^"]* rounded-3xl overflow-hidden shadow-2xl my-8"',
        lambda m: m.group(0).replace('my-8', 'my-auto shrink-0'),
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

for file in glob.glob('src/components/*Modal.tsx'):
    fix_modal(file)

