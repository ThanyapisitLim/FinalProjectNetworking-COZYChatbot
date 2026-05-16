"use client";

import Sidebar from "@/app/components/Sidebar";
import MessageBubble from "@/app/components/MessageBubble";
import TypingIndicator from "@/app/components/TypingIndicator";
import WelcomeScreen from "@/app/components/WelcomeScreen";
import ChatInput from "@/app/components/ChatInput";
import ChatHeader from "@/app/components/ChatHeader";
import { useChat } from "@/app/hooks/useChat";
import RateLimitBanner from "@/app/components/RateLimitBanner";

export default function ChatbotPage() {
  const {
    conversations,
    activeConvId,
    activeConversation,
    isTyping,
    sidebarOpen,
    isLoadingHistory,
    rateLimitRetry,
    setRateLimitRetry,
    messagesEndRef,
    setSidebarOpen,
    setActiveConvId,
    handleSend,
    handleNewChat,
    handleDeleteGroup,
  } = useChat();

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden">
      {/* Rate Limit Overlay */}
      {rateLimitRetry !== null && (
        <RateLimitBanner
          retryAfter={rateLimitRetry}
          onDismiss={() => setRateLimitRetry(null)}
        />
      )}
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={(id) => setActiveConvId(id)}
        onDelete={handleDeleteGroup}
        onNew={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          activeConversation={activeConversation}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewChat={handleNewChat}
        />

        {/* Loading state */}
        {isLoadingHistory ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">Loading chat history...</p>
            </div>
          </div>
        ) : !activeConversation || activeConversation.messages.length === 0 ? (
          <WelcomeScreen onSelect={handleSend} />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
            <div className="max-w-3xl mx-auto space-y-6">
              {activeConversation.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          disabled={isTyping || isLoadingHistory}
        />
      </div>
    </div>
  );
}
