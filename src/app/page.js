'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ServicesSection from './components/ServicesSection'
import CTASection from './components/CTASection'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'  // ✅ Import useAuth
import handleLogin from './lib/handlelogin'

const words = ["Upload.", "Pay.", "Print.", "Done."]

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  const { user, loading } = useAuth() // ✅ Use global auth context

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePlaceOrder = async () => {
    if (loading) return // Wait for auth status

    if (user) {
      router.push('/placeorder')
    } else {
      const result = await handleLogin.signInWithGoogle(true) // rememberMe = true
      if (result.success) {
        router.push('/placeorder')
      } else {
        alert('Login failed: ' + result.error.message)
      }
    }
  }

  return (
    <main className="min-h-screen bg-hero-dark text-white flex flex-col items-center justify-start pt-24 mt-6 sm:pt-32 px-6 text-center">

      {/* Animated Headline */}
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold flex flex-col sm:flex-row flex-wrap justify-center gap-4">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={isMobile ? { y: 40, opacity: 0 } : { x: -50, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: i * 0.3, type: "spring", stiffness: 100 }}
            className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: words.length * 0.3 + 0.5, duration: 1 }}
        className="mt-8 max-w-xl text-lg sm:text-xl text-gray-300"
      >
        No queues. No confusion. Upload your files, pay securely, and receive a pickup token. Your prints will be ready when you are — simple, fast, and efficient.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="mt-10 flex flex-wrap justify-center gap-6"
      >
        <button className="px-6 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition-all duration-300">
          <Link href={'/pricing'}>Get Started</Link>
        </button>

        <div className="glow rounded-full">
          <button
            className="px-6 py-2 bg-black text-white rounded-full relative z-10 hover:scale-105 transition-transform duration-300"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </motion.div>

      <ServicesSection />
      <CTASection />
    </main>
  )
}
