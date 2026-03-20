"use client";
import { motion } from "framer-motion";

export default function BotButton({ onClick }) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* "Ask AI" label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <span className="text-[#FFD700] text-[10px] font-bold bg-[#1A1200] border border-[#FFD700] px-3 py-1 rounded-full">
          Ask AI
        </span>
      </motion.div>

      {/* Pulse button */}
      <button
        onClick={onClick}
        className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-[#0A0600] shadow-2xl animate-pulse-gold transition-transform hover:scale-110 cursor-pointer"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="13" rx="3" fill="#0A0600" />
          <circle cx="9" cy="12" r="1.8" fill="#FFD700" />
          <circle cx="15" cy="12" r="1.8" fill="#FFD700" />
          <rect x="8" y="15" width="8" height="1.5" rx="1" fill="#FFD700" />
          <line x1="12" y1="6" x2="12" y2="3" stroke="#0A0600" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="2.5" r="1.2" fill="#0A0600" />
          <rect x="1" y="9" width="2" height="4" rx="1" fill="#0A0600" />
          <rect x="21" y="9" width="2" height="4" rx="1" fill="#0A0600" />
        </svg>
      </button>
    </div>
  );
}
