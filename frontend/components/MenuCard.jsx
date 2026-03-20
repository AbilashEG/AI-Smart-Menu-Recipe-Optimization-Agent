"use client";
import { motion } from "framer-motion";

const categoryColors = {
  Meal: "bg-[#FFA500] text-[#0A0600]",
  Beverage: "bg-[#64B5F6] text-[#0A0600]",
  Snack: "bg-[#00E676] text-[#0A0600]",
  Combo: "bg-[#CE93D8] text-[#0A0600]",
};

export default function MenuCard({ dish }) {
  const cat = categoryColors[dish.category] || categoryColors.Meal;
  const ingredients = dish.ingredients || [];
  const shown = ingredients.slice(0, 3);
  const extra = ingredients.length - 3;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-[#1E1200] border border-[#C9A84C] p-8 rounded-xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] group"
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-6">
        <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold ${cat}`}>
          {dish.category}
        </span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dish.is_available ? "bg-[#00E676] animate-pulse" : "bg-[#FF5252]"}`} />
          <span className={`text-[10px] uppercase font-bold ${dish.is_available ? "text-[#00E676]" : "text-[#FF5252]"}`}>
            {dish.is_available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Name & price */}
      <h3 className="text-2xl font-bold mb-2 text-[#FFF8E7] group-hover:text-[#FFD700] transition-colors">
        {dish.dish_name}
      </h3>
      <p className="text-[#FFD700] text-3xl font-serif mb-1">₹{dish.selling_price}</p>
      <p className="text-[#B8A882] text-xs mb-6">Cost: ₹{dish.cost_price}</p>

      {/* Margin bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#B8A882]">Profit Margin</span>
          <span className="text-[#00E676] font-bold">{dish.profit_margin}%</span>
        </div>
        <div className="w-full bg-[#0F0A00] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#00E676] h-full transition-all duration-700" style={{ width: `${dish.profit_margin}%` }} />
        </div>
      </div>

      {/* Ingredients */}
      <div className="flex flex-wrap gap-1.5">
        {shown.map((ing, i) => (
          <span key={i} className="text-[10px] text-[#C9A84C] bg-[#2C2000] px-2 py-0.5 rounded">
            {ing}
          </span>
        ))}
        {extra > 0 && (
          <span className="text-[10px] text-[#B8A882] bg-[#2C2000] px-2 py-0.5 rounded">
            +{extra} more
          </span>
        )}
      </div>
    </motion.div>
  );
}
