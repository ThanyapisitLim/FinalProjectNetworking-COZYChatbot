"use client";
import { useRouter } from "next/navigation";

const componentsData = [
  {
    icon: "🌐",
    title: "Frontend Layer",
    description: "Next.js 16 (App Router), React 19, TailwindCSS จัดการส่วนผู้ใช้งาน และยิง REST APIs โดยผสานการยืนยันตัวตนด้วย js-cookie และ NextAuth.",
    size: "col-span-1 md:col-span-2",
  },
  {
    icon: "⚙️",
    title: "Backend API Gateway",
    description: "Node.js, Express, TypeScript เป็นศูนย์กลางจัดการ JWT Auth, Session, ต่อฐานข้อมูล, CRUD และเรียกใช้งาน Redis Caching",
    size: "col-span-1 md:col-span-1",
  },
  {
    icon: "🧠",
    title: "AI Microservice (RAG)",
    description: "รันด้วย Python FastAPI เป็นตัวค้นหาบริบทใกล้เคียงจาก ChromaDB ก่อนจะส่งข้อมูลเข้าโมเดล LLM",
    size: "col-span-1 md:col-span-1",
  },
  {
    icon: "🦙",
    title: "LLM Engine",
    description: "ใช้งาน Ollama ร่วมกับโมเดล Llama 3.2 สร้างคำตอบภาษาธรรมชาติให้กับผู้รับแบบ Real-time",
    size: "col-span-1 md:col-span-2",
  },
  {
    icon: "💾",
    title: "Data & Caching",
    description: "Supabase (PostgreSQL) เป็นฐานข้อมูลหลัก และมี Redis เป็นด่านหน้าแคชประวัติแชทความเร็วสูง",
    size: "col-span-1 md:col-span-2",
  },
  {
    icon: "🔎",
    title: "Vector DB & MCP",
    description: "ChromaDB เก็บ Vector และมี FastMCP Server เปิดพอร์ตให้ AI Chatbot นอกดึงข้อมูลตามมาตรฐาน JSON-RPC",
    size: "col-span-1 md:col-span-1",
  },
];

const protocols = [
  { protocol: "HTTP / HTTPS", usage: "การเข้าถึงหลักจากผู้ใช้ภายนอกผ่าน Router วิ่งเข้า NGINX ทะลุสู่ Next.js, Express และ API ภายในด็อกเกอร์" },
  { protocol: "RESTful API (JSON)", usage: "รูปแบบสถาปัตยกรรมข้อมูลไร้สถานะ (Stateless) ระหว่าง Frontend ↔ Backend ↔ AI Service" },
  { protocol: "SSH (Port 22)", usage: "รัน Deploy อัตโนมัติจาก GitHub Actions วิ่งเข้ามาคุมเครื่อง Pi อย่างปลอดภัย" },
  { protocol: "RESP (TCP)", usage: "พอร์ต 6379 ภายใน (Internal Bridge) ให้ Backend คุยกับ Redis รวดเร็วไร้ดีเลย์" },
  { protocol: "PWP (PostgreSQL)", usage: "เชื่อมจากแอปส่ง Data ออกเครื่องข้ามเน็ตไปหา Supabase พอร์ต 5432 ด้วยการหุ้ม TLS/SSL" },
  { protocol: "MCP (JSON-RPC)", usage: "AI Desktop วิ่งเข้าคุยกับ MCP Server (8080) ผ่านเทคนิค HTTP Streaming (SSE)" },
  { protocol: "JWT", usage: "โครงสร้างความปลอดภัยแนบใน Headers เป็นตั๋วผ่านประตูสำหรับทุกๆ Request" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <main className="flex flex-col flex-1 w-full max-w-6xl mx-auto py-16 px-6 sm:px-10">
        
        {/* Header Section */}
        <header className="flex flex-col items-center justify-between mb-20 sm:flex-row sm:items-end gap-8">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-widest text-blue-700 bg-blue-100 rounded-full uppercase mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Microservices on Raspberry Pi
            </h2>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-600 max-w-2xl leading-[1.1] pb-2">
              System Architecture & Protocols
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl leading-relaxed font-medium">
              ภาพรวมของระบบและคู่มือเครือข่ายสำหรับระบบแชทบอทอัจฉริยะแบบแยกส่วน (Containerized) โดยทำงานร่วมกันตั้งแต่ Database, AI เอนจิน ไปจนถึง Network Routing อันซับซ้อน
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-3.5 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95"
            >
              Enter Chatbot
            </button>
          </div>
        </header>

        {/* Section 1: Component Architecture (Bento Grid) */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-200"></div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Component Architecture Layer
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {componentsData.map((comp, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-100 ${comp.size}`}
              >
                <div className="text-5xl mb-6 drop-shadow-sm">{comp.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {comp.title}
                </h3>
                <p className="mt-3 text-slate-600 text-[15px] leading-relaxed font-medium">
                  {comp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Protocols Table Grid */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-purple-500 rounded-full shadow-sm shadow-purple-200"></div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Communication Protocols
            </h3>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {protocols.map((proto, index) => (
                <div key={index} className="px-6 py-5 bg-slate-50/50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:shadow-md hover:border-purple-100 cursor-default">
                  <div className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">{proto.protocol}</div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{proto.usage}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Networking Deep Dive (Vertical Accordion Style) */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200"></div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Networking Deep Dive (TCP/IP)
            </h3>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            {/* L3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-blue-500 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">
                L3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:scale-[1.01] hover:shadow-lg hover:border-blue-100">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Network Layer</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  ใช้งาน <strong>IPv4</strong> ร่วมกับการทำ <strong>Destination NAT (Port Forwarding)</strong> เพื่อข้ามอินเทอร์เน็ตเข้ามายังวง LAN สู่ Private IP ของ Raspberry Pi ภายในมีการจัดการด้วย <strong>Docker Bridge Network</strong> ซึ่งเสมือนวงแลนซ้อนช่วยให้สื่อสารกันผ่าน Internal DNS
                </p>
              </div>
            </div>

            {/* L4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-purple-500 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">
                L4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:scale-[1.01] hover:shadow-lg hover:border-purple-100">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Transport Layer</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  สถาปัตยกรรมทุกส่วนพึ่งพา <strong>TCP</strong> โดยการันตีความถูกต้องด้วย <strong>3-Way Handshake</strong> ก้าวข้ามความล่าช้าแฝง (Latency) ของฐานข้อมูลทางไกลด้วย <strong>TCP Keep-Alive Connection Pool</strong> เพื่อหรี่การเปิดช่องเชื่อมต่อพร่ำเพรื่อ
                </p>
              </div>
            </div>

            {/* L7 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-emerald-500 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">
                L7
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:scale-[1.01] hover:shadow-lg hover:border-emerald-100">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Application Layer</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  ปกป้อง Payload ข้อมูลจากภัยคุกคามด้วย <strong>CORS Options Pre-Flight</strong> หุ้มรหัสการเชื่อมต่อฐานข้อมูลภายนอกแบบ <strong>TLS/SSL Encryption</strong> มีการใช้มาตรฐาน <strong>JSON-RPC Server-Sent Events (SSE)</strong> ขนส่งข้อมูล Context จาก AI อย่างต่อเนื่องพริ้วไหว
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 text-center border-t border-slate-200 bg-white shadow-inner">
         <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.2em]">
           Raspberry Pi 4 Cluster • Modern Setup • Final Network Project
         </p>
      </footer>
    </div>
  );
}
