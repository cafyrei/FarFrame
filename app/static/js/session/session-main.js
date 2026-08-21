import { roomCode, getSocket, participantId } from "../utils/socket.js";

const videoGrid =
  document.querySelector(".video-grid") ||
  document.getElementById("video-grid");
const cameraBtn = document.getElementById("cameraBtn");
const muteBtn = document.getElementById("muteBtn");

let mediaStream = null;

// Initialize camera on startup
initLocalVideo();

muteBtn.addEventListener("click", () => {
  stopMedia();
  console.log("end");
});

function updateParticipants(event) {
  const data = JSON.parse(event.data);

  let participant_count = null;

  if (data.type === "participant_count") {
    participant_count = data.count;
  }
}

export function addParticipantVideo(participantId, stream) {
  if (document.getElementById(`video-${participantId}`)) return;

  const videoElement = document.createElement("video");
  videoElement.id = `video-${participantId}`;
  videoElement.autoplay = true;
  videoElement.playsInline = true;
  videoElement.srcObject = stream;

  if (participantId === "local") {
    videoElement.muted = true;
  }

  videoGrid.appendChild(videoElement);
}

export async function initLocalVideo() {
  const stream = await startMedia();
  if (stream) {
    addParticipantVideo(participantId, stream);
  }

  return stream;
}

async function startMedia() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
      audio: true,
    });
    return mediaStream;
  } catch (error) {
    console.error("Error accessing media devices:", error);
    if (error.name === "NotAllowedError") {
      alert("Permission denied. Please allow camera.");
    } else if (error.name === "NotFoundError") {
      alert("No webcam or microphone found on this device.");
    } else {
      alert(`Error: ${error.message}`);
    }
    return null;
  }
}


function stopMedia() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());

    const localVideo = document.getElementById("video-local");
    if (localVideo) {
      localVideo.srcObject = null;
    }

    cameraBtn.disabled = false;
    muteBtn.disabled = false;
  }
}