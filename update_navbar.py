import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

# Make sure ShieldCheck is imported
if "ShieldCheck" not in content:
    content = content.replace("import { ", "import { ShieldCheck, ")
elif "ShieldCheck" not in content[:500]: # simplistic check
    content = content.replace("import { ", "import { ShieldCheck, ")

admin_btn = """
                  {userRole === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#c6a55e] hover:bg-[#1f2631] hover:text-[#d6b772] transition-colors flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
"""

content = content.replace(
    'My Profile\n                  </button>',
    'My Profile\n                  </button>' + admin_btn
)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)
