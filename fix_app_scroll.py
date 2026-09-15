import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace overflow-hidden on main with pb-32 to allow scrolling
content = content.replace('overflow-hidden relative', 'pb-32 relative')

with open('src/App.tsx', 'w') as f:
    f.write(content)
