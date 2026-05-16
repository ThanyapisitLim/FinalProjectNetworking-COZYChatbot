"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/api/auth";
import { setCookie } from "@/app/lib/cookie";

export default function RegisterPage() {
  const [accountName, setAccountName] = useState("");
  const [status, setStatus] = useState("นักเรียน ม.6");
  const [major, setMajor] = useState("การจัดการธุรกิจไซเบอร์ (CB)");

  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleRegister = async () => {
    if (!session?.user?.email || !accountName.trim()) return;
    setIsLoading(true);

    try {
      const data = await createUser(
        session.user.email,
        accountName,
        status,
        major,
      );
      setCookie(data.accessToken);

      localStorage.setItem("userStatus", status);
      localStorage.setItem("userMajor", major);

      router.push("/chatbot");
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    "นักเรียน ม.6",
    "เด็กซิ่ว",
    "ผู้ปกครอง",
    "ศิษย์เก่า",
    "บุคคลทั่วไป",
    "นิสิตปัจจุบัน",
  ];
  const majorOptions = [
    "การออกแบบสื่อปฏิสัมพันธ์และมัลติมีเดีย",
    "การจัดการธุรกิจไซเบอร์",
    "นวัตกรรมคอมพิวเตอร์เพื่อการสื่อสาร",
    "การผลิตภาพยนตร์และสื่อดิจิทัล",
    "การแสดงและกำกับการแสดงภาพยนตร์",
    "การออกแบบเพื่องานภาพยนตร์และสื่อดิจิทัล",
    "การจัดการภาพยนตร์และสื่อดิจิทัล",
    "การสื่อสารเพื่อการท่องเที่ยว",
    "การสื่อสารเพื่อสุขภาพ",
    "การสื่อสารเพื่อการจัดการนวัตกรรม",
    "การสื่อสารเพื่อเศรษฐศาสตร์",
    "การสื่อสารเพื่อเกษตรสร้างสรรค์",
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative overflow-hidden">
      {/* Light colorful blobs background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/40 blur-[100px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="flex flex-1 items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left bg-white/60 p-6 rounded-3xl backdrop-blur-md border border-white shadow-sm inline-block">
            <h2 className="text-xs font-bold tracking-[0.25em] text-purple-600 uppercase mb-3">
              Get Started
            </h2>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              Create Account
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              ระบุสมญานามและเลือกข้อมูลที่คุณสนใจเพื่อเริ่มต้นใช้งานแชทบอท
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
              
              {/* Account Name */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Account Name / Alias
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter Your Display Name"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Status / สถานะความเป็นมา
                </label>
                <div className="relative group">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 outline-none focus:border-purple-500 focus:bg-white cursor-pointer appearance-none transition-all shadow-inner"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Major Select */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Major / วิชาเอกที่สนใจ
                </label>
                <div className="relative group">
                  <select
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 outline-none focus:border-purple-500 focus:bg-white cursor-pointer appearance-none transition-all shadow-inner"
                  >
                    {majorOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading || !accountName.trim()}
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl px-6 py-4.5 text-[15px] text-white font-bold shadow-lg shadow-purple-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none"
            >
              {isLoading ? "Creating Profile..." : "Complete Registration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}