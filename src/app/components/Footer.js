import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full bg-[#0d0d0d] text-gray-400 text-sm py-8 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

        {/* Brand Name or Logo */}
        <div className="text-white font-semibold text-lg">
          📠 QuickPrints
        </div>

        {/* Links */}
        <div className="flex gap-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/place-order" className="hover:text-white transition-colors">Order</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-xs sm:text-sm">
          © {new Date().getFullYear()} QuickPrints. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
