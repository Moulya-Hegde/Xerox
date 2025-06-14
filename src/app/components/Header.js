"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full px-6 py-4 border-b border-white/10 bg-black relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-white">
          PrintEase
        </h1>

        {/* Desktop Nav Center */}
        <nav className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/placeorder">Place Order</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
        </nav>

        {/* Login/Signup Button (Right) */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="px-6 py-2 rounded-full text-black font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] "
          >
            Login / Signup
          </Link>
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

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-white transition-transform duration-300 rounded-md group"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-white/10 rounded-md opacity-0 group-hover:opacity-100 transition duration-300"></span>
      <span className="absolute top-0 left-1/2 w-1/2 h-[2px] bg-white/60 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition duration-300 transform -translate-x-1/2"></span>
    </Link>
  );
}
