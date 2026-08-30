import { participantId } from "../../utils/socket.js";

// ==================================================
// DOM Elements
// ==================================================

const videoGrid =
  document.querySelector(".video-grid") ||
  document.getElementById("video-grid");
setParticipantMirror
// ==================================================
// Video UI
// ==================================================

export function addParticipantVideo(videoParticipantId, stream, position) {
  const videoId = `video-${videoParticipantId}`;

  // Prevent duplicate participant videos
  if (document.getElementById(videoId)) return;

  const videoElement = document.createElement("video");

  videoElement.id = videoId;
  videoElement.autoplay = true;
  videoElement.playsInline = true;
  videoElement.srcObject = stream;
  videoElement.className = "w-full h-full object-cover";
  videoElement.style.order = String(position);

  // Don't play our own microphone back to us
  if (videoParticipantId === participantId) {
    videoElement.muted = true;
  }

  videoGrid.appendChild(videoElement);

  updateVideoLayout();
}

export function getLocalVideoElement() {
  return document.getElementById(`video-${participantId}`);
}

export function setParticipantMirror(
  videoParticipantId,
  isMirrored
) {
  const video = document.getElementById(
    `video-${videoParticipantId}`
  );

  if (!video) {
    console.warn("Participant video not available.");
    return;
  }

  video.style.transform = isMirrored
    ? "scaleX(-1)"
    : "scaleX(1)";
}

// ==================================================
// Video Layout
// ==================================================

function updateVideoLayout() {
  const count = videoGrid.querySelectorAll("video").length;

  if (count === 1) {
    videoGrid.classList.remove("grid-cols-2");
    videoGrid.classList.add("grid-cols-1");
  } else if (count === 2) {
    videoGrid.classList.remove("grid-cols-1");
    videoGrid.classList.add("grid-cols-2");
  }
}