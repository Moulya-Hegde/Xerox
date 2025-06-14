'use client'
import Link from 'next/link'

export default function MobileMenu({ isOpen, closeMenu }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-black/90 backdrop-blur-md z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 flex flex-col gap-6 mt-20 text-white text-lg">
        <MobileLink href="/" onClick={closeMenu}>Home</MobileLink>
        <MobileLink href="/about" onClick={closeMenu}>About</MobileLink>
        <MobileLink href="/placeorder" onClick={closeMenu}>Place Order</MobileLink>
        <MobileLink href="/pricing" onClick={closeMenu}>Pricing</MobileLink>

        <Link
          href="/login"
          onClick={closeMenu}
          className="inline-block px-6 py-2 rounded-full text-black font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"

        >
          Login / Signup
        </Link>
      </div>
    </div>
  )
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
  )
}
