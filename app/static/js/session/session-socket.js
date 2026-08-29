import { getSocket, participantId} from "../utils/socket.js";
import { setParticipantMirror, startStream } from "./session-camera.js";
import {
  establishRTCOffer,
  handleOffer,
  handleAnswer,
  handleCandidate,
} from "./session-rtc.js";

// WebSocket Connection
const socket = getSocket();

// State Variables
let isHost = false;
let partipantCount = null;
let offeredStarted = false;

if (socket) {
  socket.onopen = () => {
    console.log("Connected");
  };

  socket.onclose = (event) => {
    console.log("Socket closed:", event.code);
  };

  socket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    console.log("Data: ", data); // Data Check

    switch (data.type) {
      case "participant_joined":
        if (data.role === 'host' && participantId === data.participantId) {
          isHost = true;
        } 
        partipantCount = data.count;

        break;

      // RTC COMMUNICATION CASES
      case "offer":
        handleOffer(data.offer, data.participantId, data.role);
        break;
      case "answer":
        handleAnswer(data.answer, data.participantId);
        break;
      case "candidate":
        handleCandidate(data.candidate);
        break;

      // SESSION EVENT CASES
      case "mirror_changed":
        setParticipantMirror(data.participantId, data.mirrored);
        break;
    }

    // This Establish(starts) the handshake
    if (!offeredStarted) {
      if (isHost && partipantCount === 2) {
        offeredStarted = true;
        establishRTCOffer(data.role);
      }
    }
  };
}

// Session Functions

export function sendMirrorState(isMirrored) {
  if(socket?.readyState !== WebSocket.OPEN) return;
  
  socket.send(
    JSON.stringify({
      type: "mirror_changed",
      participantId,
      mirrored: isMirrored,
    }),
  );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// TEMPORARY BUTTON FOR DEBUGGING
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// const testBtn = document.getElementById("testBtn");

// testBtn.addEventListener("click", () => {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(
//       JSON.stringify({
//         type: "test",
//         message: "Hello!",
//       }),
//     );
//   }
// });

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// TO HERE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
