let socketInstance = null;

// Parse once at the module level so any file can access them
const urlParams = new URLSearchParams(window.location.search);
export const roomCode = urlParams.get("room_code");
export const participantId = urlParams.get("participantId");

/**
 * Helper to generate page links with room params preserved
 * @param {string} path - Target path (e.g., '/session')
 */
export function buildRoomUrl(path) {
  const params = new URLSearchParams();
  if (roomCode) params.set("room_code", roomCode);
  if (participantId) params.set("participantId", participantId);

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Returns a singleton WebSocket instance
 */
export function getSocket() {
  if (socketInstance) return socketInstance;

  if (!roomCode || !participantId) {
    console.error("Missing required URL parameters for WebSocket connection.");
    return null;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  socketInstance = new WebSocket(
    `${protocol}//${window.location.host}/ws/${roomCode}/${participantId}`
  );

  return socketInstance;
}