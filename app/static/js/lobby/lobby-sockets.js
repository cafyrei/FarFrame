import {
  updateRoomId,
  updateParticipantCount,
  createParticipantCard,
  removeParticipantCard,
  buttonAssignments,
} from "./lobby-main.js";
import { getSocket, buildRoomUrl, participantId } from "../utils/socket.js";

const startBtnContainer = document.getElementById("role-container");
const leaveRoomBtn = document.getElementById("leaveRoomBtn");

const socket = getSocket();

updateRoomId();

if (socket) {
  // Handle connection events
  socket.onopen = () => {
    console.log("Connected");
  };

  // Socket Participant Entry Denied (Fabricated Id) or Disconnected
  socket.onclose = (event) => {
    console.log("left");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Data Check:", data); // Data Check
    updateParticipantCount(data.count);

    switch (data.type) {
      case "participant_joined":
        createParticipantCard(data.role, data.avatar, data.participantId);
        if (data.role === "host") {
          buttonAssignments(data.role, data.participantId, participantId);
        }
        break;

      case "existing_participants":
        data.participants.forEach((participant) => {
          createParticipantCard(
            participant.role,
            participant.avatar,
            participant.participantId,
          );
        });

        break;
        
      case "existing_participants":
        data.participants.forEach((participant) => {
          createParticipantCard(participant.role, participant.avatar, participant.participantId);
        });
        
        break;

      case "start_session":
        window.location.href = buildRoomUrl("/session");
        break;

      case "participant_left":
        removeParticipantCard(data.participantId);
        break;
      // default:
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

startBtnContainer.addEventListener("click", (event) => {

  if (event.target.id === "startBtn") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "start_session",
        }),
      );
    } else {
      console.warn("WebSocket is not connected yet.");
    }
  }
});

leaveRoomBtn?.addEventListener("click", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "leave_session",
      }),
    );
  } else {
    console.warn("WebSocket is not connected yet.");
  }

  window.location.href = "/home";
});
