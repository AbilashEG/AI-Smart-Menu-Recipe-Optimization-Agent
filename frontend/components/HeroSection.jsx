"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PARTICLE_COLORS = ["#FFD700", "#FFA500", "#C9A84C"];

export default function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId;

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 80 }, () => {
        const colorIdx = Math.floor(Math.random() * 3);
        const size = colorIdx === 0 ? Math.random() * 2 + 2.5 : colorIdx === 1 ? Math.random() * 1.5 + 1.5 : Math.random() * 1 + 1;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedY: Math.random() * -0.5 - 0.2,
          opacity: Math.random() * 0.15 + 0.65,
          color: PARTICLE_COLORS[colorIdx],
          glow: colorIdx === 0,
        };
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.glow) {
          ctx.shadowColor = "rgba(255, 215, 0, 0.6)";
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speedY;
        if (p.y < 0) p.y = canvas.height;
      });
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero warm amber overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(120,60,0,0.55) 0%, rgba(80,35,0,0.35) 40%, rgba(20,10,0,0.0) 100%)",
        }}
      />

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-block border border-[#FFD700] text-[#FFD700] text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-[#FFD700]/10">
            AI-Powered Smart Menu Agent
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-5xl md:text-8xl font-serif mb-6 text-[#FFF8E7]"
        >
          AI-Powered <br />
          <span className="text-[#FFD700] italic">Restaurant Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-xl md:text-2xl text-[#B8A882] font-light mb-10"
        >
          Real-time menu optimization & smart recommendations
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <a
            href="#live-menu"
            className="border border-[#FFD700] text-[#FFD700] px-8 py-3 rounded-full hover:bg-[#FFD700] hover:text-[#0A0600] transition-all duration-300 font-semibold tracking-widest uppercase text-xs hover:shadow-[0_0_25px_rgba(255,215,0,0.4)]"
          >
            Explore Dashboard
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>
    </section>
  );
}
