'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaUpload, FaListAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const steps = [
  { label: 'Upload', href: '/placeorder/upload', icon: FaUpload },
  { label: 'Summary', href: '/placeorder/summary', icon: FaListAlt },
  { label: 'Payment', href: '/placeorder/payment', icon: FaCreditCard },
  { label: 'Status', href: '/placeorder/status', icon: FaCheckCircle },
];

export default function PlaceOrderLayout({ children }) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => pathname.startsWith(step.href));

  return (
    <div className="min-h-screen w-full bg-black text-white mt-14">
      {/* Step Bar */}
      <div className="w-full px-6 pt-6">
        <div className="relative flex justify-between items-center max-w-5xl mx-auto">
          {/* Line Behind Dots */}
          <div className="absolute top-[28px] left-0 w-full h-[2px] bg-white/10 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={index} className="relative z-10 flex flex-col items-center text-center min-w-[60px]">
                <Link href={step.href} scroll={false}>
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCompleted ? 'bg-green-400 text-black' : ''}
                      ${isActive ? 'bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.4)] scale-105' : ''}
                      ${!isCompleted && !isActive ? 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white' : ''}
                    `}
                  >
                    <Icon size={18} />
                  </div>
                </Link>
                <span
                  className={`mt-2 text-sm transition-colors duration-200 font-medium ${
                    isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Children Page Content */}
      <main className="mt-10 px-6 sm:px-12">{children}</main>
    </div>
  );
}
