'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // ✅ Use shared auth context
import handleLogin from '../lib/handlelogin';

export default function MobileMenu({ isOpen, closeMenu }) {
  const { user } = useAuth(); // ✅ Use global auth state

  const handleLogout = async () => {
    await handleLogin.logout();
    closeMenu();
  };

  const handleLoginClick = async () => {
    const result = await handleLogin.signInWithGoogle(true);
    if (!result.success) alert('Login failed');
    closeMenu();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-black/90 backdrop-blur-md z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 flex flex-col gap-6 mt-20 text-white text-lg">
        <MobileLink href="/" onClick={closeMenu}>Home</MobileLink>
        <MobileLink href="/about" onClick={closeMenu}>About</MobileLink>
        {user && <MobileLink href="/placeorder/upload" onClick={closeMenu}>Place Order</MobileLink>}
        <MobileLink href="/pricing" onClick={closeMenu}>Pricing</MobileLink>

        {user && (
          <>
            <MobileLink href="/myorders" onClick={closeMenu}>My Orders</MobileLink>
            <div className="flex items-center gap-4 mt-4">
              <img
                src={user.photoURL || '/defaultImage.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/defaultImage.png';
                }}
              />
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300 transition-all"
              >
                Logout
              </button>
            </div>
          </>
        )}

        {!user && (
          <button
            onClick={handleLoginClick}
            className="inline-block px-6 py-2 rounded-full text-black font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

function MobileLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="hover:pl-4 transition-all duration-300"
    >
      {children}
    </Link>
  );
}
