"use client";

const suggestions = [
  {
    icon: "✨",
    title: "Explain a concept",
    prompt: "Explain how neural networks work in simple terms",
  },
  {
    icon: "💻",
    title: "Write some code",
    prompt: "Write a Python function to sort a list using merge sort",
  },
  {
    icon: "📝",
    title: "Help me write",
    prompt: "Help me draft a professional email to my professor",
  },
  {
    icon: "🔍",
    title: "Analyze data",
    prompt: "What are the key factors to consider when analyzing data?",
  },
];

interface WelcomeScreenProps {
  onSelect: (prompt: string) => void;
}

export default function WelcomeScreen({ onSelect }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo / Title */}
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
          <svg
            className="w-10 h-10 text-white drop-shadow-md"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455-2.456z"
            />
          </svg>
        </div>
        <div className="absolute -inset-8 bg-linear-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Smart Chatbot
      </h1>
      <p className="text-slate-500 font-medium text-center max-w-sm mb-16 leading-relaxed">
        Powered by local Llama 3.2 — Ask me anything about COSCI, coding, or academic projects.
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
        {suggestions.map((s) => (
          <button
            key={s.title}
            onClick={() => onSelect(s.prompt)}
            className="
              text-left p-6 rounded-3xl border border-slate-100 bg-white
              shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group
              active:scale-[0.97]
            "
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
              {s.icon}
            </div>
            <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors block mb-1">
              {s.title}
            </span>
            <span className="text-[13px] font-medium text-slate-400 block line-clamp-1">
              {s.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
