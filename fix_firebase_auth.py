import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

new_auth = """// Auth helpers
export const signInWithGoogle = async (requestedRole: 'user' | 'admin' = 'user', adminSecretCode?: string) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in DB, if not create them
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    let finalRole = 'user';
    
    // Validate Admin Secret Code
    if (requestedRole === 'admin') {
      if (adminSecretCode === '786786') { // The secret code
        finalRole = 'admin';
      } else {
        throw new Error('Invalid Admin Secret Code.');
      }
    }
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: finalRole,
        zikrCount: 0,
        searchHistory: [],
        createdAt: new Date().toISOString()
      });
    } else {
      // If user exists and requested admin with valid code, upgrade them
      if (finalRole === 'admin' && userSnap.data().role !== 'admin') {
        await updateDoc(userRef, { role: 'admin' });
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};"""

content = re.sub(r'// Auth helpers.*export const logout = \(\) => signOut\(auth\);', new_auth + '\n\nexport const logout = () => signOut(auth);', content, flags=re.DOTALL)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)

