import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("<AdminDashboard />", "<AdminDashboard userRole={userRole} />")

with open('src/App.tsx', 'w') as f:
    f.write(content)
