import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    try {
        const response = await fetch(`${API_URL}/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
        });

        if (!response.ok) return null;

        const data = await response.json();
        Cookies.set("token", data.accessToken, { expires: 7 });
        return data.accessToken;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
    }
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = Cookies.get("token");

    const buildRequest = (accessToken?: string): RequestInit => ({
        ...options,
        credentials: "include" as RequestCredentials,
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
            ...options.headers,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
    });

    let response = await fetch(`${API_URL}${endpoint}`, buildRequest(token));

    if (response.status === 429) {
        const data = await response.clone().json().catch(() => null);
        const retryAfter = data?.retryAfter ?? 60;
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("rate-limit", { detail: { retryAfter } }));
        }
        return response;
    }

    if (response.status === 401) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.error === "Token expired") {
            // deduplicate concurrent refresh calls
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshAccessToken().finally(() => {
                    isRefreshing = false;
                    refreshPromise = null;
                });
            }

            const newToken = await refreshPromise;

            if (newToken) {
                response = await fetch(`${API_URL}${endpoint}`, buildRequest(newToken));
            } else {
                Cookies.remove("token");
                if (typeof window !== "undefined") window.location.href = "/login";
            }
        }
    }

    return response;
}
