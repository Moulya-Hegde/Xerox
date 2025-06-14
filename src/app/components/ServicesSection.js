'use client'

import { motion } from 'framer-motion'
import {
  FaPrint, FaCopy, FaFileAlt, FaBookOpen,
  FaPaperclip, FaStore,  FaCloudUploadAlt, FaLayerGroup
} from 'react-icons/fa'

const services = [
  {
    title: 'Printing',
    desc: 'High-quality color & B/W prints in various paper sizes.',
    icon: <FaPrint size={28} />
  },
  {
    title: 'Xerox',
    desc: 'Quick and reliable document photocopying services.',
    icon: <FaCopy size={28} />
  },
  {
    title: 'A3 Prints',
    desc: 'Large format prints with crisp detail and professional finish.',
    icon: <FaFileAlt size={28} />
  },
  {
    title: 'Soft Binding',
    desc: 'Perfect for projects, reports & college submissions.',
    icon: <FaBookOpen size={28} />
  },
  {
    title: 'Spiral Binding',
    desc: 'Durable spiral binds with a clean, organized look.',
    icon: <FaPaperclip size={28} />
  },
  {
    title: 'In-Store Stationery',
    desc: 'Pens, files, sheets & other essentials, all under one roof.',
    icon: <FaStore size={28} />
  },
  {
    title: 'Scanning Services',
    desc: 'Fast document scanning & digital delivery options.',
    icon: < FaCloudUploadAlt size={28} />
  },
  {
    title: 'Lamination',
    desc: 'Protect your documents with high-quality lamination.',
    icon: <FaLayerGroup size={28} />
  }
]

export default function ServicesSection() {
  return (
    <div className="py-24 mt-24 bg-hero-dark px-6 sm:px-16 bg-[#0e0e0e] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -z-10 w-[500px] h-[500px] bg-[#00dfd8]/20 blur-[140px] top-10 left-[-200px]" />
      <div className="absolute -z-10 w-[400px] h-[400px] bg-[#7928ca]/20 blur-[120px] bottom-0 right-[-150px]" />

      {/* Heading */}
      <h2 className="text-center text-4xl sm:text-5xl font-bold mb-4 font-merienda">
        Our Services
      </h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12 text-lg">
        From everyday prints to project-ready bindings — explore everything we offer to keep you organized and on time.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(0,124,240,0.2)] transition duration-300 group"
          >
            <div className="mb-4 text-[#00DFD8] group-hover:text-[#00b8b2] transition">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
