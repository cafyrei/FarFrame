import {
  updateRoomId,
  updateParticipantCount,
  createParticipantCard,
} from "./lobby-main.js";
import { getSocket, buildRoomUrl } from "../utils/socket.js";

const test_button = document.getElementById("test-socket");
const startBtn = document.getElementById("startBtn");

const socket = getSocket();

updateRoomId();

if (socket) {
  // Handle connection events
  socket.onopen = () => {
    console.log("Connected");
  };

  // Socket Participant Entry Denied (Fabricated Id) or Disconnected
  socket.onclose = (event) => {
    console.log("Socket closed:", event.code);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Data Check:", data); // Data Check

    switch (data.type) {
      case "participant_count":
        updateParticipantCount(data.count);
        break;

      case "role":
        if (data.role === "host") {
          createParticipantCard('host', data.avatar);
        } else {
          createParticipantCard('guest', data.avatar);
        }
        break;

      case "start_session":
        window.location.href = buildRoomUrl("/session");
        break;

      case "test":
        console.log("Test message:", data.message);
        break;

      default:
      console.log("Unknown message:", data);
    }
  };

  // Catch: Going back will close the socket
  window.addEventListener("pagehide", () => {
    socket.close();
  });
} else {
  console.error(
    "Failed to initialize WebSocket: Missing required parameters or connection error.",
  );
}

startBtn?.addEventListener("click", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "start_session",
      }),
    );
  } else {
    console.warn("WebSocket is not connected yet.");
  }
});

// =============================
//   TEST BUTTON DELETE AFTER
// =============================

test_button?.addEventListener("click", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "test",
        message: "Hello!",
      }),
    );
  }
});

// =============================
//       UP TO THIS POINT
// =============================
