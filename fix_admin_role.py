import re

with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

# Add imports for firestore
if "import { doc, updateDoc } from 'firebase/firestore';" not in content:
    content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { doc, updateDoc } from 'firebase/firestore';\nimport { db } from '../lib/firebase';")

# Add the handleUpgrade function
upgrade_fn = """
  const handleMakeAdmin = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: 'admin' });
      alert("Success! You are now an Admin. Please refresh the app.");
    } catch (error) {
      console.error(error);
      alert("Failed to update role.");
    }
  };
"""

content = content.replace("const { theme, toggleTheme } = useTheme();", "const { theme, toggleTheme } = useTheme();\n" + upgrade_fn)

# Add the button next to the role badge
role_badge = """              <span className="inline-block px-3 py-1 bg-[#c6a55e]/10 border border-[#c6a55e]/30 text-[#c6a55e] text-xs font-bold uppercase tracking-wider rounded-lg">
                Role: {userRole}
              </span>"""

upgrade_btn = """              <div className="flex flex-col gap-2 items-center sm:items-end">
                <span className="inline-block px-3 py-1 bg-[#c6a55e]/10 border border-[#c6a55e]/30 text-[#c6a55e] text-xs font-bold uppercase tracking-wider rounded-lg">
                  Role: {userRole}
                </span>
                {userRole !== 'admin' && (
                  <button onClick={handleMakeAdmin} className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition-colors">
                    Make Me Admin
                  </button>
                )}
              </div>"""

content = content.replace(role_badge, upgrade_btn)

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)

