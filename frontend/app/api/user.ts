import { fetchWithAuth } from '../lib/fetchWithAuth'

export async function getUser() {
    const response = await fetchWithAuth("/get-user");

    if (!response.ok) {
        throw new Error("Failed to get user");
    }

    return response.json();
}