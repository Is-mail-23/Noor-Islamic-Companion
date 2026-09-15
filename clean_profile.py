import re

with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

# Remove handleMakeUser and handleMakeAdmin functions entirely
content = re.sub(r'const handleMakeUser = async \(\) => \{.*?\};\n', '', content, flags=re.DOTALL)
content = re.sub(r'const handleMakeAdmin = async \(\) => \{.*?\};\n', '', content, flags=re.DOTALL)

# Remove the buttons
# We just want to keep the role badge:
# <span className="inline-block px-3 py-1 bg-[#c6a55e]/10 border border-[#c6a55e]/30 text-[#c6a55e] text-xs font-bold uppercase tracking-wider rounded-lg">
#   Role: {userRole}
# </span>
role_div_regex = r'<div className="flex flex-col gap-2 items-center sm:items-end">.*?</div>'
clean_badge = """<div className="mb-2 shrink-0">
                <span className="inline-block px-3 py-1 bg-[#c6a55e]/10 border border-[#c6a55e]/30 text-[#c6a55e] text-xs font-bold uppercase tracking-wider rounded-lg">
                  Role: {userRole}
                </span>
              </div>"""

content = re.sub(role_div_regex, clean_badge, content, flags=re.DOTALL)

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)

