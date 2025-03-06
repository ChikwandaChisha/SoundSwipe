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

// export async function getAppleMusicDevToken() {
//   // GET /music/dev-token returns Apple Music dev token from backend
//   const res = await fetch(`${API_URL}/music/dev-token`);
//   const data = await res.json();
//   return data.token;
// }

// Debug version
export async function getAppleMusicDevToken() {
  const url = `${API_URL}/music/dev-token`;
  console.log("getAppleMusicDevToken -> fetching:", url);

  try {
    const res = await fetch(url);
    console.log("getAppleMusicDevToken -> status:", res.status);

    if (!res.ok) {
      // If status is not 200–299, read text to see if it’s an error page
      const errorText = await res.text();
      console.log("getAppleMusicDevToken -> error text:", errorText);
      throw new Error(`Dev token fetch failed. Status ${res.status}`);
    }

    // If we get here, presumably we got a 200
    const data = await res.json();
    console.log("getAppleMusicDevToken -> success data:", data);
    return data; // data should have { token: '...' }
  } catch (err) {
    console.error("getAppleMusicDevToken -> caught error:", err);
    throw err; // re-throw so the caller sees it
  }
}


export async function getAppleMusicUserToken(docId) {
  const res = await fetch(`${API_URL}/users/${docId}/apple-music-token`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Could not fetch Apple Music token');
  }
  return data; // e.g. { found: true, appleMusicUserToken: "XYZ" }
}

export async function storeAppleMusicToken(docId, musicUserToken) {
  // POST /users/:docId/apple-music-token stores Apple Music token in Firestore
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

