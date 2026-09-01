import { getSocket, participantId} from "../utils/socket.js";
import { setParticipantMirror, setFilter } from "./media/video.js";
import { initLocalVideo } from "./media/camera.js";
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
let myPosition = null;

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

        if (participantId === data.participantId) {
          myPosition = data.position;
          await initLocalVideo(myPosition);
        }
        partipantCount = data.count;

        break;

      // RTC COMMUNICATION CASES
      case "offer":
        await handleOffer(data.offer, data.participantId, data.position, myPosition);
        break;
      case "answer":
        await handleAnswer(data.answer, data.participantId, data.position);
        break;
      case "candidate":
        await handleCandidate(data.candidate);
        break;

      // SESSION EVENT CASES
      case "mirror_changed":
        setParticipantMirror(data.participantId, data.mirrored);
        break;
      case "filter_changed":
        setFilter(data.filter);
        break;
    }

    // This Establish(starts) the handshake
    if (!offeredStarted) {
      if (isHost && partipantCount === 2) {
        offeredStarted = true;
        establishRTCOffer(myPosition);
      }
    }
  };
}

// Session Functions
export function sendMirrorState(mirrored) {
  if(socket?.readyState !== WebSocket.OPEN) return;
  
  socket.send(
    JSON.stringify({
      type: "mirror_changed",
      participantId,
      mirrored,
    }),
  );
}

export function sendFilterState(filter) {
  if(socket?.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "filter_changed",
      participantId,
      filter,
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
