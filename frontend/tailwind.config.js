/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0F0A00",
        cardBg: "#1F1700",
        cardAlt: "#1A1200",
        gold: "#FFD700",
        amber: "#FFA500",
        cream: "#FFF8E7",
        muted: "#B8A882",
        accent: "#E8C84A",
        sectionBg: "#1C1400",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "DM Sans", "sans-serif"],
      },
      animation: {
        "pulse-gold": "pulse-gold 2s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 3s ease-in-out infinite",
        "scroll-left": "scroll-left 40s linear infinite",
        "scroll-right": "scroll-right 40s linear infinite",
        "fade-in-up": "fadeInUp 1s ease-out forwards",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,215,0,0.7)" },
          "50%": { boxShadow: "0 0 0 15px rgba(255,215,0,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
