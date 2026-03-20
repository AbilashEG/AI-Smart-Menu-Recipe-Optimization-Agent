"use client";

const slotColors = {
  Morning: "bg-[#FFD700] text-[#0A0600]",
  Afternoon: "bg-[#FFA500] text-[#0A0600]",
  Evening: "bg-[#FF8C00] text-[#0A0600]",
};

export default function OrderTable({ orders }) {
  return (
    <div className="border border-[#C9A84C] rounded-xl overflow-hidden bg-[#1E1200] shadow-2xl">
      <div className="overflow-y-auto max-h-[500px] scroll-hide">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#1E1200] border-b border-[#C9A84C] z-20">
            <tr>
              <th className="p-6 text-xs uppercase tracking-widest text-[#FFD700] font-medium">Outlet</th>
              <th className="p-6 text-xs uppercase tracking-widest text-[#FFD700] font-medium">Dish Name</th>
              <th className="p-6 text-xs uppercase tracking-widest text-[#FFD700] font-medium text-center">Orders</th>
              <th className="p-6 text-xs uppercase tracking-widest text-[#FFD700] font-medium">Time Slot</th>
              <th className="p-6 text-xs uppercase tracking-widest text-[#FFD700] font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9A84C]/20">
            {orders.map((o, idx) => (
              <tr
                key={o.order_id}
                className={`hover:bg-[#2C1A00] transition-colors ${idx % 2 === 1 ? "bg-[#1A1200]" : "bg-[#1E1200]"}`}
              >
                <td className="p-6 text-sm text-[#FFF8E7]">{o.outlet}</td>
                <td className="p-6 font-medium text-[#FFF8E7]">{o.dish_name}</td>
                <td className="p-6 text-center text-xl font-bold text-[#FFD700]">{o.order_count}</td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${slotColors[o.time_slot] || "bg-gray-500 text-white"}`}
                  >
                    {o.time_slot}
                  </span>
                </td>
                <td className="p-6 text-right text-[#00E676] font-bold">₹{o.revenue?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
