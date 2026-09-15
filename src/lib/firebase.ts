import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

// Initialize Firebase
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);

export { app, auth, db };

// Auth helpers
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
};

export const logout = () => signOut(auth);
