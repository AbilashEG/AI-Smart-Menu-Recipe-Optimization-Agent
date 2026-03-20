"use client";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Highlight tier/action keywords in AI responses
function formatAIText(text) {
  const badges = [
    { keyword: "STAR", cls: "bg-[#FFD700] text-[#0A0600] border-[#FFD700]" },
    { keyword: "SLEEPER", cls: "bg-[#64B5F6] text-[#0A0600] border-[#64B5F6]" },
    { keyword: "PROBLEM", cls: "bg-[#FF5252] text-[#FFF8E7] border-[#FF5252]" },
    { keyword: "DEADWEIGHT", cls: "bg-[#888888] text-[#FFF8E7] border-[#888888]" },
    { keyword: "PROMOTE NOW", cls: "bg-[#00E676] text-[#0A0600] border-[#00E676]" },
    { keyword: "MARKET MORE", cls: "bg-[#64B5F6] text-[#0A0600] border-[#64B5F6]" },
    { keyword: "FIX RECIPE", cls: "bg-[#FF5252] text-[#FFF8E7] border-[#FF5252]" },
    { keyword: "REVIEW REMOVAL", cls: "bg-[#888888] text-[#FFF8E7] border-[#888888]" },
    { keyword: "IMMEDIATE", cls: "bg-[#FFA500] text-[#0A0600] border-[#FFA500]" },
  ];

  let result = text;
  badges.forEach(({ keyword, cls }) => {
    const regex = new RegExp(`(${keyword})`, "gi");
    result = result.replace(
      regex,
      `<span class="inline-block text-[10px] px-1.5 py-0.5 rounded border font-bold ${cls} mx-0.5">$1</span>`
    );
  });

  // Convert newlines to <br>
  result = result.replace(/\n/g, "<br/>");
  return result;
}

function LoadingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#1F1700] border border-[#C9A84C] px-4 py-3 rounded-2xl rounded-tl-none">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 bg-[#FFD700] rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatPanel({
  messages,
  isLoading,
  isChatOpen,
  inputValue,
  closeChat,
  setInputValue,
  sendMessage,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage(inputValue);
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ y: 800, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 800, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-6 right-6 w-[580px] h-[780px] bg-[#1A1200] border border-[#FFD700] rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] z-[998] flex flex-col overflow-hidden"
        >
          {/* Header — 72px */}
          <div className="bg-[#1A1200] border-b border-[#C9A84C] px-5 py-4 flex justify-between items-center shrink-0 h-[72px]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#FFD700] rounded-lg flex items-center justify-center">
                <span className="text-[#0A0600] font-bold text-lg">A</span>
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-[#FFD700]">Restaurant AI Assistant</h4>
                <p className="text-[12px] text-[#00E676]">System Online</p>
              </div>
            </div>
            <button onClick={closeChat} className="text-[#B8A882] hover:text-[#FFF8E7]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* Messages — fills remaining space */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-hide">
            {messages.length === 0 && (
              <p className="text-[#B8A882] text-center text-sm mt-40">
                Ask anything about your menu, orders, or reviews...
              </p>
            )}

            {messages.map((msg, idx) =>
              msg.role === "user" ? (
                <div key={idx} className="flex justify-end">
                  <div className="bg-[#2C1A00] border border-[#FFD700] text-[#FFF8E7] px-4 py-3 rounded-2xl rounded-tr-none max-w-[75%] text-[14px] font-medium">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={idx} className="flex justify-start">
                  <div className="bg-[#1F1700] border-l-[3px] border-[#FFD700] text-[#FFF8E7] px-4 py-4 rounded-2xl rounded-tl-none max-w-[90%] text-[14px] leading-[1.7]">
                    <div dangerouslySetInnerHTML={{ __html: formatAIText(msg.content) }} />
                  </div>
                </div>
              )
            )}

            {isLoading && <LoadingDots />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input — 80px */}
          <div className="px-4 py-4 border-t border-[#C9A84C] shrink-0 h-[80px]">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your menu..."
                className="flex-1 bg-[#0F0A00] border border-[#C9A84C] rounded-xl px-4 py-3 text-[14px] text-[#FFF8E7] focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] placeholder:text-[#B8A882]/50 outline-none h-[48px]"
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading}
                className="w-[52px] h-[48px] bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center text-[#0A0600] hover:brightness-110 disabled:opacity-50 shrink-0"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
