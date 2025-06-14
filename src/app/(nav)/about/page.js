'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

const reviews = [
  { name: "Riya S.", rating: 5, review: "Quick and reliable service! Perfect for college students." },
  { name: "Arjun P.", rating: 4, review: "Affordable prices and quality prints. Will visit again!" },
  { name: "Nikita D.", rating: 5, review: "Loved the easy order process and friendly staff!" },
];

const images = [
  "/bg-waves.png",
  "/shoes.png",
  "/bg-waves.png",
];

export default function AboutPage() {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="min-h-screen pt-[120px] px-6 bg-black text-white">
      {/* Shop Intro */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">About <span className='bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent'>PrintEase</span></h1>
        <p className="text-lg text-gray-300">
          spanPrintEase is a modern printing and xerox hub located in the heart of [Your Area Name], Bengaluru.
          We’re focused on fast, convenient, and reliable printing for students and professionals alike —
          all available through a sleek online experience and in-store pickup.
        </p>
      </div>

      {/* Map Card */}
      <div className="mt-12 flex justify-center">
        <a
          href="https://maps.google.com/?q=Dsatm, Bengaluru"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white px-6 py-4 rounded-xl text-white text-lg font-semibold shadow-xl hover:scale-105 transition hover:bg-white/10"
        >
          📍 View Us on Google Maps
        </a>
      </div>

      {/* User Reviews */}
      <div className="mt-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-xl backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl transition">
              <h3 className="text-lg font-bold">{r.name}</h3>
              <div className="flex items-center gap-1 text-yellow-400 mt-1">
                {Array(r.rating).fill().map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm text-gray-300 mt-3">{r.review}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Slider */}
      <div className="mt-20 max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-semibold mb-4">A Glimpse of Our Shop</h2>
        <div className="relative">
          <Image
            src={images[currentImage]}
            alt={`Shop image ${currentImage + 1}`}
            width={800}
            height={450}
            className="rounded-lg shadow-xl mx-auto object-cover h-[300px] w-full sm:h-[400px]"
          />
          <div className="flex justify-center gap-4 mt-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-3 h-3 rounded-full ${idx === currentImage ? 'bg-white' : 'bg-white/30'} transition`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
