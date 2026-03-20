"use client";

const sentimentStyles = {
  Positive: {
    bg: "bg-[#00E676]/10",
    border: "border-[#00E676]/50",
    shadow: "shadow-[0_0_20px_rgba(0,230,118,0.15)]",
    badge: "bg-[#00E676] text-[#0A0600]",
  },
  Negative: {
    bg: "bg-[#FF5252]/10",
    border: "border-[#FF5252]/50",
    shadow: "shadow-[0_0_20px_rgba(255,82,82,0.15)]",
    badge: "bg-[#FF5252] text-[#FFF8E7]",
  },
  Neutral: {
    bg: "bg-[#64B5F6]/10",
    border: "border-[#64B5F6]/50",
    shadow: "shadow-[0_0_20px_rgba(100,181,246,0.15)]",
    badge: "bg-[#64B5F6] text-[#0A0600]",
  },
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="text-[#FFD700]">
      {"★".repeat(full)}
      {half && "★"}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function ReviewCard({ review }) {
  const s = sentimentStyles[review.sentiment] || sentimentStyles.Neutral;

  return (
    <div
      className={`inline-block w-[350px] ${s.bg} border ${s.border} p-6 rounded-xl ${s.shadow} flex-shrink-0`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-[#FFF8E7]">{review.dish_name}</span>
        <span className={`${s.badge} text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
          {review.sentiment}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Stars rating={review.rating} />
        <span className="text-[#FFD700] text-xs font-bold">{review.rating}</span>
      </div>
      <p className="text-[#FFF8E7] italic whitespace-normal text-sm leading-relaxed mb-3">
        &ldquo;{review.comment}&rdquo;
      </p>
      <div className="flex justify-between text-[10px] text-[#B8A882]">
        <span>{review.outlet}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
}
