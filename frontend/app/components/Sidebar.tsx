"use client";

import { useEffect, useState } from "react";
import { Conversation } from "../types/chat";
import { getUser } from "../api/user";
import LogoutButton from "./LogoutButton"; // Import ปุ่ม Logout ที่เราทำไว้
import Link from "next/link"; // Import Link สำหรับไปหน้า Profile

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (groupId: string) => Promise<void>;
  onNew: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNew,
  isOpen,
  onClose,
}: SidebarProps) {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ควบคุมการเปิด/ปิดเมนู

  useEffect(() => {
    async function fetchUserData() {
      const user = await getUser();
      setUser(user);
    }
    fetchUserData();
  }, []);

  const firstLetter = user?.[0]?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}
      
      <aside className={`
          fixed top-0 left-0 z-40 h-full w-72 bg-slate-50 border-r border-slate-200
          flex flex-col transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
        
        {/* New Chat Button */}
        <div className="p-4 border-b border-slate-200">
          <button onClick={onNew} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-700 transition-all active:scale-[0.98] shadow-sm">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversations list */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-slate-400 px-3 py-6 text-center italic font-medium">No conversations yet</p>
          )}
          {conversations.map((conv) => (
            <div key={conv.id} className={`group flex items-center justify-between w-full px-1.5 py-1 rounded-xl transition-all duration-200 ${
                activeId === conv.id ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
              }`}>
              <button 
                onClick={() => { onSelect(conv.id); onClose(); }}
                className="flex-1 text-left px-2.5 py-1.5 text-sm truncate font-medium"
                title={conv.title}
              >
                {conv.title}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this group?")) {
                    onDelete(conv.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                title="Delete conversation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </nav>

        {/* Bottom Section (User & Menu) */}
        <div className="p-4 border-t border-slate-200 relative">
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute bottom-20 left-4 right-4 z-50 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <Link href="/profile" onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Your Profile
              </Link>
              <div className="h-[1px] bg-slate-100 my-1 mx-1" />
              <LogoutButton />
            </div>
          )}

          {/* User Bar */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left ${
              isMenuOpen ? 'bg-white ring-1 ring-slate-200 shadow-md' : 'hover:bg-slate-200/50'
            }`}>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-extrabold shrink-0 shadow-lg shadow-blue-500/20">
              {firstLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.[0]?.name}</p>
              <p className="text-[11px] font-medium text-slate-400 truncate">{user?.[0]?.gmail}</p>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180 text-blue-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}