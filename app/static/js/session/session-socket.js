import { getSocket, participantId} from "../utils/socket.js";
import { startCountdown, resetCaptureSession } from "../utils/capture-img.js";
import { filterTextLabel } from "../utils/filters-utils.js";
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
        filterTextLabel(data.filter);
        break;
      case "capture_sequence":
        startCountdown();
      case "reset_capture":
        resetCaptureSession();
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

// SESSION EVENT TEMPLATE
function sendSessionEvent(type, payload = {}) {
  if (socket?.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type,
      participantId,
      ...payload,
    })
  );
}

export function sendMirrorState(mirrored) {
  sendSessionEvent("mirror_changed", { mirrored });
}

export function sendFilterState(filter) {
  sendSessionEvent("filter_changed", { filter });
}

export function initiateCaptureSequence() {
  sendSessionEvent("capture_sequence");
}

export function resetCaptureSequence() {
  sendSessionEvent("reset_capture");
}