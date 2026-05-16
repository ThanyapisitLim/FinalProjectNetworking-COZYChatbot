"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatInputProps } from "../types/chat";

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white/80 backdrop-blur-xl px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-[1.5rem] px-5 py-3 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-md transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="
              flex-1 bg-transparent text-[15px] font-medium text-slate-900 placeholder-slate-400
              resize-none outline-none py-2 max-h-[200px]
              disabled:opacity-50
            "
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="
              shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center
              bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all
              hover:bg-blue-700 active:scale-90
              disabled:opacity-20 disabled:grayscale disabled:active:scale-100
            "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
              />
            </svg>
          </button>
        </div>
        <p className="text-[11px] font-bold text-slate-400 text-center mt-3 uppercase tracking-widest">
          Smart Chatbot can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
