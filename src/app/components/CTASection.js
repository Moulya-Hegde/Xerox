'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import handleLogin from '../lib/handlelogin'
import { useRouter } from 'next/navigation'
const CTASection = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
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
    <section className="w-full px-6 sm:px-10 py-20 text-white">
      {/* CTA Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto rounded-xl bg-[#1a1a1a] px-8 sm:px-14 py-14 text-center shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
          Ready When You Are.
        </h2>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          Upload your files from anywhere. We'll print and notify you when it's ready — no standing in line.
        </p>

        
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#ffffff10' }}
            whileTap={{ scale: 0.98 }}
            className="border border-white text-white px-7 py-3 rounded-full font-medium transition duration-300 hover:bg-white/10"
            onClick={handlePlaceOrder}
          >
            Place Your Order
          </motion.button>
        
      </motion.div>
    </section>
  )
}

export default CTASection
