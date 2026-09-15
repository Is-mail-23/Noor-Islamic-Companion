import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

content = content.replace("""                  {userRole === 'admin' && (
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
                  )}""", """                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#c6a55e] hover:bg-[#1f2631] hover:text-[#d6b772] transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {userRole === 'admin' ? 'Admin Dashboard' : 'Admin Sign In'}
                  </button>""")

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)
