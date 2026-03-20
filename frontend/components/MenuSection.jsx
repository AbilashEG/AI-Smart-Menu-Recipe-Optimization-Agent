"use client";
import { motion } from "framer-motion";
import useMenuData from "@/hooks/useMenuData";
import MenuCard from "./MenuCard";

export default function MenuSection() {
  const { menuItems, loading, error } = useMenuData();

  return (
    <section id="live-menu" className="py-24 px-6 md:px-12 max-w-7xl mx-auto" style={{ background: 'linear-gradient(180deg, #080400 0%, #0F0800 30%, #0F0800 70%, #080400 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-[#FFD700] mb-4">Today&apos;s Menu Highlights</h2>
        <div className="h-1 w-24 bg-[#FFA500] mx-auto mb-3" />
        <p className="text-[#B8A882] text-sm">Live from restaurant_menu table</p>
      </motion.div>

      {error && (
        <p className="text-center text-[#FF5252] py-10">Failed to load menu: {error}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1F1700] border border-[#C9A84C]/20 p-8 rounded-xl animate-pulse h-72" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((dish, idx) => (
            <motion.div
              key={dish.dish_id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <MenuCard dish={dish} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
