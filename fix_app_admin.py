import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Change {activeTab === 'admin' && userRole === 'admin' && (
content = content.replace("{activeTab === 'admin' && userRole === 'admin' && (", "{activeTab === 'admin' && (")

with open('src/App.tsx', 'w') as f:
    f.write(content)
