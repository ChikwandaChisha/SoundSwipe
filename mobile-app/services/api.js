// services/api.js
const API_URL = "https://project-api-soundswipe.onrender.com/api/v1";

export async function checkUserDoc(uid) {
  const res = await fetch(`${API_URL}/users/check?uid=${uid}`);
  const data = await res.json();
  return data; 
}

export async function createUserDoc(uid, email) {
  const res = await fetch(`${API_URL}/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, email }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error || "Unknown error" };
  }
  // If 201
  return { ok: true, docId: data.docId };
}

export async function getUserDocById(docId) {
  const res = await fetch(`${API_URL}/users/${docId}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch user doc (status ${res.status})`);
  }
  const data = await res.json();
  // data looks like { user: {...} }
  return data.user;
}

export async function getAppleMusicDevToken() {
  // GET /music/dev-token returns Apple Music dev token from backend
  const res = await fetch(`${API_URL}/music/dev-token`);
  const data = await res.json();
  return data.token;
}

export async function storeAppleMusicToken(docId, musicUserToken) {
  const res = await fetch(`${API_URL}/users/${docId}/apple-music-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ musicUserToken }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Could not store Apple Music token');
  }
}
