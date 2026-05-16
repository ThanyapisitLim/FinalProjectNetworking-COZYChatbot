"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "../api/user"; // สมมติว่ามีฟังก์ชันนี้ดึงข้อมูลชื่อ/อีเมล

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: "", status: "", major: "" });

  useEffect(() => {
    async function init() {
      // ดึงข้อมูลพื้นฐานจาก API
      const user = await getUser();
      
      // ดึงค่า "สถานะ" และ "เอก" ที่เลือกไว้จาก LocalStorage (ที่เซ็ตมาจากหน้า Sign-in)
      const status = localStorage.getItem("userStatus") || "ไม่ได้ระบุ";
      const major = localStorage.getItem("userMajor") || "ไม่ได้ระบุ";
      
      setUserData({
        name: user?.[0]?.name || "Visitor",
        status: status,
        major: major
      });
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <Link href="/chatbot" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-10 text-sm font-bold transition-all group">
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          Back to AI Assistant
        </Link>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="p-10 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white flex items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl shadow-blue-500/30">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{userData.name}</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Active Member</span>
                <span className="text-slate-400 text-xs font-medium italic">COSCI Visitor Ecosystem</span>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-8">
            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Current Status / สถานะ</p>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold text-slate-700 shadow-inner">
                  {userData.status}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Interested Major / เอกที่สนใจ</p>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold text-slate-700 shadow-inner">
                  {userData.major}
                </div>
              </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-xs font-medium text-slate-300 italic">
                You are currently viewing a secured profile managed by local infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}