import { getSocket } from "../utils/socket.js";
import { establishRTCOffer, handleOffer } from "./session-rtc.js";

// WebSocket Connection
const socket = getSocket();

// Temporary Button
const testBtn = document.getElementById("testBtn");

let isHost = false;
let partipantCount = 0;
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
      case "role":
        if (data.role === "host") {
          isHost = true;
        }
        break;
      case "participant_count":
        partipantCount = data.count;
        break;
      case "offer":
        handleOffer(data.offer);
        break;
      case "answer":
        handleAnswer(data.answer);
        break
    }

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

testBtn.addEventListener("click", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "test",
        message: "Hello!",
      }),
    );
  }
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// TO HERE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
