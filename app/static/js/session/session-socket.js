import { getSocket } from "../utils/socket.js";
import {
  establishRTCOffer,
  handleOffer,
  handleAnswer,
  handleCandidate,
} from "./session-rtc.js";

// WebSocket Connection
const socket = getSocket();

// Temporary Button
const testBtn = document.getElementById("testBtn");

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
        if (data.role === 'host') {
          isHost = true;
        } 
        
        partipantCount = data.count;

        console.log("Participant Count: " + partipantCount); 

        break;
      case "offer":
        handleOffer(data.offer, data.participantId);
        break;
      case "answer":
        handleAnswer(data.answer, data.participantId);
        break;
      case "candidate":
        handleCandidate(data.candidate);
        break;
    }

    // This Establish(starts) the handshake
    if (!offeredStarted) {
      if (isHost && partipantCount === 2) {
        offeredStarted = true;
        establishRTCOffer();
      }
    }
  };
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// TEMPORARY BUTTON FOR DEBUGGING
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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
