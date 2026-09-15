import re

with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

make_user_fn = """
  const handleMakeUser = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: 'user' });
      alert("Success! You are now a User. Please refresh the app.");
    } catch (error) {
      console.error(error);
      alert("Failed to update role.");
    }
  };
"""

content = content.replace('const handleMakeAdmin = async () => {', make_user_fn + '\n  const handleMakeAdmin = async () => {')

btn_to_add = """                {userRole === 'admin' && (
                  <button onClick={handleMakeUser} className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-1 rounded hover:bg-sky-500/30 transition-colors">
                    Make Me User
                  </button>
                )}"""

content = content.replace("</button>\n                )}", f"</button>\n                )}}\n{btn_to_add}")

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)

