'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Your AuthContext
import HeaderLoginButton from './HeaderLoginButton'; // ✅ Import the dropdown button

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Auth state from context
  const pathname = usePathname();

  return (
    <header className="h-content w-full px-6 py-4 border-b border-white/10 bg-black fixed z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-white cursor-pointer">
          <Link href="/">QuickPrints</Link>
        </h1>

        {/* Desktop Nav Center */}
        <nav className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2">
          <NavLink href="/" pathname={pathname}>Home</NavLink>
          <NavLink href="/about" pathname={pathname}>About</NavLink>
          {user && <NavLink href="/placeorder/upload" pathname={pathname}>Place Order</NavLink>}
          <NavLink href="/pricing" pathname={pathname}>Pricing</NavLink>
        </nav>

        {/* Right Side - Login/Profile Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          <HeaderLoginButton />
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white z-50 relative"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} closeMenu={() => setIsOpen(false)} />
    </header>
  );
}

// NavLink accepts pathname to compare against href
function NavLink({ href, children, pathname }) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-white transition duration-300 rounded-md group
        ${isActive ? 'bg-white/10 shadow-inner' : ''}
      `}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute inset-0 rounded-md transition duration-300 
        ${isActive ? 'opacity-100 bg-white/10' : 'opacity-0 group-hover:opacity-100 bg-white/10'}`}
      ></span>
      <span
        className={`absolute top-0 left-1/2 w-1/2 h-[2px] bg-white/60 rounded-full blur-sm transition duration-300 transform -translate-x-1/2
        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      ></span>
    </Link>
  );
}
