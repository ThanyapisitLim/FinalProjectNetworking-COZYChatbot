import { fetchWithAuth } from '../lib/fetchWithAuth'

// ── Get all messages from DB ────────────────────────────────────────
export async function getMessages() {
    const response = await fetchWithAuth("/message");

    if (!response.ok) {
        throw new Error("Failed to get messages");
    }

    return response.json();
}

// ── Delete all messages (clear history) ─────────────────────────────
export async function deleteMessages() {
    const response = await fetchWithAuth("/message", {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete messages");
    }

    return response.json();
}

// ── Chat directly via backend ───────────────────────────────────────
export async function deleteConversationGroup(groupId: string) {
    const response = await fetchWithAuth(`/message/group/${groupId}`, {
        method: "DELETE",
    });
    return response;
}

export async function chatWithAI(question: string, groupId?: string) {
    const response = await fetchWithAuth("/message/chat", {
        method: "POST",
        body: JSON.stringify({ question, groupId }),
    });

    if (!response.ok) {
        throw new Error("Failed to chat with AI");
    }

    return response.json();
}
