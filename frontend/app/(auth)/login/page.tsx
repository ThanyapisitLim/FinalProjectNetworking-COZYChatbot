"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left panel — Branding (สว่างขึ้น) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white items-center justify-center border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-3xl mix-blend-multiply" />

        <div className="relative z-10 max-w-md px-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-blue-500 to-indigo-600 mb-8 shadow-xl shadow-blue-500/20">
            <span className="text-4xl drop-shadow-sm">🤖</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-5">
            Cozy Chatbot
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed font-medium">
            Your friendly AI assistant for all COSCI SWU inquiries, news, and support.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { icon: "🧠", label: "COSCI SWU" },
              { icon: "⚡", label: "Instant News" },
              { icon: "🔍", label: "Program Search" },
              { icon: "🗄️", label: "Admissions" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md cursor-default"
              >
                <span className="text-xl">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — ขาว สว่าง */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        <div className="w-full max-w-md relative z-10">
          
          <div className="text-center mb-10">
            <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl shadow-blue-500/20">
              <span className="text-3xl drop-shadow-sm">🤖</span>
            </div>
            <h2 className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase mb-3">
              Authentication
            </h2>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              Welcome back
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Login with your Google account to instantly access your chatting workspace.
            </p>
          </div>

          {/* Google Login Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <button
              onClick={() => signIn("google", { callbackUrl: "/redirect" })}
              disabled={isLoading}
              className="group relative w-full flex items-center justify-center gap-3 bg-white border-[1.5px] border-slate-200 rounded-2xl px-6 py-4.5 text-[15px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-blue-400 hover:shadow-md active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                  <span>Connecting securely...</span>
                </div>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="tracking-tight">Sign in with Google</span>
                </>
              )}
            </button>

            <div className="mt-8 flex items-center gap-3 text-[11px] text-slate-400 justify-center uppercase tracking-[0.15em] font-bold">
              <span className="w-10 h-[1px] bg-slate-200" />
              Secure Infrastructure
              <span className="w-10 h-[1px] bg-slate-200" />
            </div>
          </div>

          <div className="space-y-8 text-center mt-8">
            <p className="text-[15px] text-slate-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="pt-8 border-t border-slate-200">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest leading-loose font-bold">
                Final Project — Smart Chatbot System
                <br />© 2026 Tech Stack: Next.js, Node.js, FastApi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
