"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import OrdersSection from "@/components/OrdersSection";
import ReviewsSection from "@/components/ReviewsSection";
import BotButton from "@/components/BotButton";
import ChatPanel from "@/components/ChatPanel";
import useChat from "@/hooks/useChat";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const chat = useChat();

  const heroRef = useRef(null);
  const menuRef = useRef(null);
  const ordersRef = useRef(null);
  const reviewsRef = useRef(null);

  const sectionRefs = [heroRef, menuRef, ordersRef, reviewsRef];
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observers = sectionRefs.map((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(index);
            }
          });
        },
        { threshold: 0.5 }
      );
      if (ref.current) {
        observer.observe(ref.current);
      }
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gold z-[999] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation dots */}
      <div
        style={{
          position: "fixed",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          zIndex: 997,
        }}
      >
        {sectionRefs.map((ref, index) => (
          <button
            key={index}
            onClick={() => {
              sectionRefs[index].current?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            style={{
              width: activeSection === index ? "12px" : "8px",
              height: activeSection === index ? "12px" : "8px",
              borderRadius: "50%",
              border: "1.5px solid #FFD700",
              background: activeSection === index ? "#FFD700" : "transparent",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
              boxShadow:
                activeSection === index
                  ? "0 0 8px 2px rgba(255, 215, 0, 0.6)"
                  : "none",
            }}
          />
        ))}
      </div>

      {/* Sections */}
      <div ref={heroRef}>
        <HeroSection />
      </div>
      <div ref={menuRef}>
        <MenuSection />
      </div>
      <div ref={ordersRef}>
        <OrdersSection />
      </div>
      <div ref={reviewsRef}>
        <ReviewsSection />
      </div>

      {/* Chat bot */}
      <BotButton onClick={chat.isChatOpen ? chat.closeChat : chat.openChat} />
      <ChatPanel
        messages={chat.messages}
        isLoading={chat.isLoading}
        isChatOpen={chat.isChatOpen}
        inputValue={chat.inputValue}
        closeChat={chat.closeChat}
        setInputValue={chat.setInputValue}
        sendMessage={chat.sendMessage}
      />
    </>
  );
}
