"use client";
import { useEffect, useState } from "react";

interface RateLimitBannerProps {
  retryAfter: number; // seconds
  onDismiss: () => void;
}

export default function RateLimitBanner({ retryAfter, onDismiss }: RateLimitBannerProps) {
  const [countdown, setCountdown] = useState(retryAfter);

  useEffect(() => {
    setCountdown(retryAfter);
  }, [retryAfter]);

  useEffect(() => {
    if (countdown <= 0) {
      onDismiss();
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, onDismiss]);

  const progress = ((retryAfter - countdown) / retryAfter) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 flex flex-col items-center gap-6">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-4xl">🚦</span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Too Many Requests</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            คุณส่งคำขอมากเกินไป<br />
            กรุณารอสักครู่แล้วลองใหม่อีกครั้ง
          </p>
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="text-5xl font-black text-red-500 tabular-nums">
            {countdown}
          </div>
          <p className="text-slate-400 text-xs">วินาที</p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-red-400 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* HTTP Info */}
        <div className="w-full bg-slate-50 rounded-2xl px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">HTTP Status</span>
          <span className="text-sm font-extrabold text-red-500">429 Too Many Requests</span>
        </div>

        <p className="text-xs text-slate-400 text-center">
          ระบบจำกัดไว้ที่ 20 requests / 60 วินาที / IP
        </p>
      </div>
    </div>
  );
}
