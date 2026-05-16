import { useState, useRef, useEffect, useCallback } from "react";
import { Message, Conversation } from "@/app/types/chat";
import { getMessages, deleteConversationGroup } from "@/app/api/message";
import Cookies from "js-cookie";

const WS_URL = (process.env.NEXT_PUBLIC_API_URL || "")
  .replace("https://", "wss://")
  .replace("http://", "ws://")
  .replace("/api", "") + "/ws/chat";

const uid = () => Math.random().toString(36).slice(2, 10);

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [rateLimitRetry, setRateLimitRetry] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, isTyping]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ retryAfter: number }>).detail;
      setRateLimitRetry(detail.retryAfter);
    };
    window.addEventListener("rate-limit", handler);
    return () => window.removeEventListener("rate-limit", handler);
  }, []);

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await getMessages();
        const dbMessages: Record<string, unknown>[] = result.data || [];

        if (dbMessages.length > 0) {
          const grouped: Record<string, Message[]> = {};

          dbMessages.forEach((m) => {
            const gId = m.group_id !== undefined && m.group_id !== null ? String(m.group_id) : "legacy_chat";
            if (!grouped[gId]) grouped[gId] = [];

            grouped[gId].push({
              id: m.message_id !== undefined && m.message_id !== null ? String(m.message_id) : uid(),
              role: m.role as "user" | "assistant",
              content: m.context as string,
              timestamp: new Date(m.created_at as string | number | Date),
            });
          });

          const loadedConversations: Conversation[] = Object.entries(grouped).map(([gId, msgs]) => {
            const firstUserMsg = msgs.find((m) => m.role === "user");
            const title = firstUserMsg
              ? firstUserMsg.content.length > 40
                ? firstUserMsg.content.slice(0, 40) + "…"
                : firstUserMsg.content
              : "Chat History";

            return {
              id: gId,
              title,
              messages: msgs,
              updatedAt: msgs[msgs.length - 1]?.timestamp || new Date(),
            };
          });

          loadedConversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          setConversations(loadedConversations);
          setActiveConvId(loadedConversations[0].id);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  const addMessage = (convId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date() }
          : c,
      ),
    );
  };

  const handleSend = useCallback((text: string) => {
    const isNewChat = !activeConvId;
    let convId = activeConvId || "temp_" + uid();

    if (isNewChat) {
      const title = text.length > 40 ? text.slice(0, 40) + "…" : text;
      setConversations((prev) => [
        { id: convId, title, messages: [], updatedAt: new Date() },
        ...prev,
      ]);
      setActiveConvId(convId);
    }

    const userMsg: Message = { id: uid(), role: "user", content: text, timestamp: new Date() };
    addMessage(convId, userMsg);
    setIsTyping(true);

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      const token = Cookies.get("token");
      ws.send(JSON.stringify({
        question: text,
        token,
        groupId: isNewChat ? undefined : convId,
      }));
    };

    const streamingMsgId = uid();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.status === "thinking") {
        const realGroupId = data.groupId.toString();
        if (isNewChat) {
          const oldConvId = convId;
          setConversations((prev) =>
            prev.map((c) => (c.id === oldConvId ? { ...c, id: realGroupId } : c))
          );
          setActiveConvId(realGroupId);
          convId = realGroupId;
        }
        addMessage(convId, { id: streamingMsgId, role: "assistant", content: "", timestamp: new Date() });
        setIsTyping(false);
      }

      if (data.status === "chunk") {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === streamingMsgId ? { ...m, content: m.content + data.text } : m
                  ),
                }
              : c
          )
        );
      }

      if (data.status === "done") {
        ws.close();
      }

      if (data.status === "rate_limit") {
        setIsTyping(false);
        setRateLimitRetry(data.retryAfter);
        ws.close();
        return;
      }

      if (data.error) {
        addMessage(convId, {
          id: uid(),
          role: "assistant",
          content: "ขออภัย เกิดข้อผิดพลาดในการสื่อสารกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง",
          timestamp: new Date(),
        });
        setIsTyping(false);
        ws.close();
      }
    };

    ws.onerror = () => {
      addMessage(convId, {
        id: uid(),
        role: "assistant",
        content: "ขออภัย เกิดข้อผิดพลาดในการสื่อสารกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง",
        timestamp: new Date(),
      });
      setIsTyping(false);
    };
  }, [activeConvId, conversations]);

  const handleNewChat = () => {
    // deselect without deleting — DB history is preserved
    setActiveConvId(null);
    setSidebarOpen(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (activeConvId === groupId) setActiveConvId(null);
    setConversations((prev) => prev.filter((c) => c.id !== groupId));

    try {
      await deleteConversationGroup(groupId);
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  return {
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
  };
}
