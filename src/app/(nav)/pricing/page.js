'use client';

import { motion } from 'framer-motion';
import CTASection from '../../components/CTASection';

const pricingPlans = [
  {
    title: 'Black & White Printing',
    price: '₹1 per page',
    features: ['A4 paper', 'Single side', 'Laser printing'],
  },
  {
    title: 'Color Printing',
    price: '₹5 per page',
    features: ['A4 paper', 'High quality', 'Inkjet printing'],
  },
  {
    title: 'A3 Prints',
    price: '₹10 per page',
    features: ['Color or B/W', 'Large format', 'Good for posters'],
  },
  {
    title: 'Xerox',
    price: '₹1 per page',
    features: ['Fast copying', 'High volume available'],
  },
  {
    title: 'Spiral Binding',
    price: '₹25–₹40',
    features: ['Plastic/metal coil', 'Up to 200 pages'],
  },
  {
    title: 'Soft Binding',
    price: '₹50–₹80',
    features: ['Padded spine', 'Professional finish'],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-black text-white">
      <section className="text-center max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Transparent & Affordable <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Pricing</span>
        </motion.h1>

        <motion.p
          className="text-gray-400 text-lg sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Clear pricing for all our services—no surprises. Choose what you need and pay only for that.
        </motion.p>
      </section>

      <section className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={index}
            className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-md hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:border-teal-400 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2">{plan.title}</h2>
            <p className="text-teal-400 text-lg font-bold mb-4">{plan.price}</p>
            <ul className="text-sm text-gray-300 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="before:content-['•'] before:mr-2 before:text-teal-400">{feature}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>
      <CTASection />
    </main>
  );
}
