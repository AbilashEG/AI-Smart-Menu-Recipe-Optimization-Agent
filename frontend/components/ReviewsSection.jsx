"use client";
import { motion } from "framer-motion";
import useReviewData from "@/hooks/useReviewData";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection() {
  const { reviews, loading, error } = useReviewData();

  // Split reviews into two rows
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  const row2 = reviews.slice(mid);

  // Duplicate for seamless loop
  const loop1 = [...row1, ...row1];
  const loop2 = [...row2, ...row2];

  return (
    <section id="feedback" className="py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #080400 0%, #0F0800 30%, #0F0800 70%, #080400 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 md:px-12 mb-12 text-center"
      >
        <h2 className="text-4xl font-serif text-[#FFD700] mb-2">Live Customer Feedback</h2>
        <p className="text-[#B8A882]">Real reviews from restaurant_reviews table</p>
      </motion.div>

      {error && (
        <p className="text-center text-[#FF5252] py-10">Failed to load reviews: {error}</p>
      )}

      {loading ? (
        <div className="flex gap-6 px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[350px] h-48 bg-[#1F1700] border border-[#C9A84C]/20 rounded-xl animate-pulse flex-shrink-0" />
          ))}
        </div>
      ) : (
        <>
          {/* Row 1 — scrolls left */}
          <div
            className="mb-8"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex gap-6 animate-scroll-left whitespace-nowrap">
              {loop1.map((r, i) => (
                <ReviewCard key={`r1-${i}`} review={r} />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div
            style={{
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex gap-6 animate-scroll-right whitespace-nowrap">
              {loop2.map((r, i) => (
                <ReviewCard key={`r2-${i}`} review={r} />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
