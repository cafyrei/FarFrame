import { updateRoomId, updateParticipantCount } from "./lobby-main.js";

const test_button = document.getElementById("test-socket");

updateRoomId();

// Setup WebSocket
const room_code = new URLSearchParams(window.location.search).get("room_code");
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(
  `${protocol}//${window.location.host}/ws/${room_code}`,
);

// Catch: Going back will close the socket
window.addEventListener("pagehide", () => {
    socket.close();
});


// Socket Open when a user join
socket.onopen = () => {
  console.log("Connected to room:", room_code);
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "participant_count") {
        updateParticipantCount(data.count)
  }

  console.log("Received:", data);
};

test_button?.addEventListener("click", () => {
  socket.send(
    JSON.stringify({
      type: "test",
      message: "Hello!",
    }),
  );
});
