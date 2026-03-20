"use client";
import { motion } from "framer-motion";
import useOrderData from "@/hooks/useOrderData";
import OrderTable from "./OrderTable";

export default function OrdersSection() {
  const { orders, loading, error } = useOrderData();

  return (
    <section id="orders" className="py-24" style={{ background: 'linear-gradient(180deg, #080400 0%, #0F0800 30%, #0F0800 70%, #080400 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-serif text-[#FFD700] mb-2">Today&apos;s Orders</h2>
          <p className="text-[#B8A882] text-sm">Live from restaurant_orders table</p>
        </motion.div>

        {error && (
          <p className="text-center text-[#FF5252] py-10">Failed to load orders: {error}</p>
        )}

        {loading ? (
          <div className="bg-[#1F1700] border border-[#C9A84C]/20 rounded-xl animate-pulse h-80" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <OrderTable orders={orders} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
