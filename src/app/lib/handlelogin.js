// lib/handleLogin.js
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
  } from 'firebase/auth';
  
  import { auth } from './firebaseconfig';
  
  // Sign in with Google
  export const signInWithGoogle = async (rememberMe = false) => {
    const provider = new GoogleAuthProvider();
  
    try {
      // Set persistence based on "Remember Me"
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
  
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error };
    }
  };
  
  // Sign out
  export const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    }
  };
export default { signInWithGoogle, logout };