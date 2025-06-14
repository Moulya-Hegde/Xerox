"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-content w-full px-6 py-4 border-b border-white/10 bg-black fixed z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-white cursor-pointer">
         <Link href="/">QuickPrints</Link>
        </h1>

        {/* Desktop Nav Center */}
        <nav className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/placeorder/upload">Place Order</NavLink>
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
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-white transition duration-300 rounded-md group
        ${isActive ? "bg-white/10 shadow-inner" : ""}
      `}
    >
      <span className="relative z-10">{children}</span>

      {/* Hover + Active Background */}
      <span
        className={`absolute inset-0 rounded-md transition duration-300 
        ${isActive ? "opacity-100 bg-white/10" : "opacity-0 group-hover:opacity-100 bg-white/10"}
      `}
      ></span>

      {/* Top Glow Line */}
      <span
        className={`absolute top-0 left-1/2 w-1/2 h-[2px] bg-white/60 rounded-full blur-sm transition duration-300 transform -translate-x-1/2
        ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
      ></span>
    </Link>
  );
}