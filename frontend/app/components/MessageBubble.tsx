"use client";

import { Message } from "../types/chat";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 max-w-3xl ${
        isUser ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`
          w-9 h-9 rounded-2xl flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 shadow-sm
          ${
            isUser
              ? "bg-white border border-slate-200 text-slate-600"
              : "bg-linear-to-br from-blue-500 to-indigo-600 text-white"
          }
        `}
      >
        {isUser ? "YOU" : "AI"}
      </div>

      {/* Content */}
      <div
        className={`
          py-3.5 px-5 rounded-[1.5rem] text-[15px] font-medium leading-relaxed whitespace-pre-wrap max-w-[85%] shadow-sm
          ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-md"
              : "bg-slate-100 border border-slate-200/50 text-slate-800 rounded-tl-md"
          }
        `}
      >
        {message.content}
      </div>
    </div>
  );
}
