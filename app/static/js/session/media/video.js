import { participantId } from "../../utils/socket.js";

// ==================================================
// DOM Elements
// ==================================================

const videoGrid =
  document.querySelector(".video-grid") ||
  document.getElementById("video-grid");
setParticipantMirror;

// ==================================================
// Filter List
// ==================================================

const filterStyles = {
  none: "none",
  grayscale: "grayscale(100%)",
  sepia: "sepia(100%)",
  vintage: "sepia(50%) contrast(120%) brightness(90%)",
  vivid: "saturate(200%) contrast(110%)",
};

// ==================================================
// Video UI
// ==================================================

export function addParticipantVideo(videoParticipantId, stream, position) {
  const videoId = `video-${videoParticipantId}`;
  console.log("Creating video:", videoId);

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
  console.log("Looking for:", `video-${participantId}`);
  console.log("Found:", document.getElementById(`video-${participantId}`));

  return document.getElementById(`video-${participantId}`);
}


// ==================================================
// Changes Happen in Video
// ==================================================

export function setFilter(filter) {
  if (!videoGrid) {
    console.warn("Video grid not found.");
    return;
  }

  if (videoGrid) {
    videoGrid.style.filter = filterStyles[filter] || "none";
  }
}

export function setParticipantMirror(videoParticipantId, isMirrored) {
  const video = document.getElementById(`video-${videoParticipantId}`);

  if (!video) {
    console.warn("Participant video not available.");
    return;
  }

  video.style.transform = isMirrored ? "scaleX(-1)" : "scaleX(1)";
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
