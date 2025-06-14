'use client'

import { motion } from 'framer-motion'
import React from 'react'

const services = [
  {
    title: "Printing",
    description: "High-quality document and photo printing on a variety of paper types."
  },
  {
    title: "Xerox",
    description: "Fast and reliable black & white or color photocopying services."
  },
  {
    title: "A3 Prints",
    description: "Get large format prints for posters, projects, and more."
  },
  {
    title: "Soft Bindings",
    description: "Professional softcover binding for reports, theses, and books."
  },
  {
    title: "Spiral Bindings",
    description: "Affordable spiral binding ideal for projects and documents."
  },
  {
    title: "In-store Stationery",
    description: "Essential pens, papers, files, and more available at your convenience."
  },
  {
    title: "Scanning Services",
    description: "Quick document scanning and digital delivery."
  },
  {
    title: "ID Card Printing",
    description: "Print professional-looking custom ID cards instantly."
  }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
}

const ServicesSection = () => {
  return (
    <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto mt-24 mb-15">
      <motion.h2
        className="pt-12 text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Our Services
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white overflow-hidden transition-transform duration-300 hover:scale-[1.05]"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 z-0 rounded-2xl before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-cyan-400/30 before:to-blue-600/30 before:blur-xl before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500" />

            <div className="relative z-10 ">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-lg text-gray-300 leading-snug">{service.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
