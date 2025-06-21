'use client';
import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../lib/firebaseconfig'; // This should export `auth` from Firebase
import handleLogin from '../lib/handlelogin'; // Your custom file
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HeaderLoginButton() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageSrc = user?.photoURL && !hasError ? user.photoURL : "/defaultImage.png";
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      console.log(user)
    });
    return () => unsubscribe();
  }, []);


	const handleGoogleLogin = async () => {
	  const result = await handleLogin.signInWithGoogle(true); // true = rememberMe

	  if (!result.success) {
		alert('Login failed: ' + result.error.message);
		return;
	  }

	  const firebaseUser = result.user;

	  try {
		const res = await fetch("/api/users", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			uid: firebaseUser.uid,
			name: firebaseUser.displayName,
			email: firebaseUser.email,
			phone: firebaseUser.phoneNumber, // may be null
		  }),
		});

		const data = await res.json();
		if (!res.ok) {
		  console.error("Backend user sync failed:", data.error);
		}
	  } catch (err) {
		console.error("Failed to send user to backend:", err);
	  }
	};


  const handleLogout = async () => {
    await handleLogin.logout();
    setMenuOpen(false);
    router.push('/');
  };

  if (!user) {
    return (
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-2 rounded-full text-black font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border border-white/20 hover:ring-2 hover:ring-white/40 transition-all"
      >
       <img
        src={imageSrc}
        alt="Profile"
        className="w-full h-full object-cover rounded-full"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
      />
      {!isLoaded && (
        <img
          src="/defaultImage.png"
          alt="Loading fallback"
          className="w-full h-full object-cover rounded-full absolute top-0 left-0"
        />
      )}

      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-black border border-white/10 rounded-lg shadow-lg py-2 z-50">
          <Link
            href="/myorders"
            onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition"
          >
            <FileText className="w-4 h-4 mr-2" />
            My Orders
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
