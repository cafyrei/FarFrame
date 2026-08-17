import { updateRoomId, updateParticipantCount } from "./lobby-main.js";

const test_button = document.getElementById("test-socket");
const startBtn = document.getElementById("startBtn");

updateRoomId();

// Setup WebSocket
const room_code = new URLSearchParams(window.location.search).get("room_code");
const participantId = new URLSearchParams(window.location.search).get("participantId");
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(
  `${protocol}//${window.location.host}/ws/${room_code}/${participantId}`,
);

// Catch: Going back will close the socket
window.addEventListener("pagehide", () => {
  socket.close();
});

// Socket Open when a user join
socket.onopen = () => {
  console.log("Connected to room:", room_code);
};

// Sockett Participant Entry Denied (Fabricated Id)
socket.onclose = (event) => {
    console.log("Socket closed:", event.code);
};


socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "participant_count") {
    updateParticipantCount(data.count);
  }

  if (data.type === "start_session") {
    window.location.href = `/session?room_code=${encodeURIComponent(room_code)}`;
  }

  console.log("Received:", data);
};

// =============================
//   TEST BUTTON DELETE AFTER
// =============================

test_button?.addEventListener("click", () => {
  socket.send(
    JSON.stringify({
      type: "test",
      message: "Hello!",
    }),
  );
});

// =============================
//      UP TO THIS POINT
// =============================

startBtn.addEventListener("click", () => {
  socket.send(
    JSON.stringify({
      type: "start_session",
    }),
  );
});
