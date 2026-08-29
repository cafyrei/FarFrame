import { participantId } from "../utils/socket.js";

// ==================================================
// DOM Elements
// ==================================================

const videoGrid =
  document.querySelector(".video-grid") ||
  document.getElementById("video-grid");

const cameraList = document.getElementById("cameraList");

// ==================================================
// Media State
// ==================================================

let mediaStream = null;

// ==================================================
// Media Controls
// ==================================================

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
      alert("Permission denied. Please allow camera access.");
    } else if (error.name === "NotFoundError") {
      alert("No webcam or microphone found on this device.");
    } else {
      alert(`Error: ${error.message}`);
    }

    return null;
  }
}

export function setParticipantMirror(participantId, isMirrored) {
  const video = document.getElementById(`video-${participantId}`);

  if (!video) {
    console.warn("Local video not available.");
    return;
  }

  video.style.transform = isMirrored ? "scaleX(-1)" : "scaleX(1)";
}

// NOTE: THIS FUNCTION IS NOT USED AND NOT DELETED FOR FUTURE UPDATE
//       IF TIME COMES WE INCLUDE ABILITY TO TURN OFF CAMERA FOR PARTICIPANTS
//       AGAIN NOTE !!!! NOT REFERENCED TO ANY FILES!!!!

export function stopMedia() {
  if (!mediaStream) return;

  mediaStream.getTracks().forEach((track) => {
    track.stop();
  });

  const localVideo = document.getElementById(`video-${participantId}`);

  if (localVideo) {
    localVideo.srcObject = null;
  }

  cameraBtn.disabled = false;
  muteBtn.disabled = false;
}

// ==================================================
// Video UI
// ==================================================

export async function initLocalVideo() {
  const stream = await startMedia();

  if (stream) {
    addParticipantVideo(participantId, stream);
  }

  return stream;
}

export function addParticipantVideo(videoParticipantId, stream) {
  const videoId = `video-${videoParticipantId}`;

  // Prevent duplicate participant videos
  if (document.getElementById(videoId)) return;

  const videoElement = document.createElement("video");

  videoElement.id = videoId;
  videoElement.autoplay = true;
  videoElement.playsInline = true;
  videoElement.srcObject = stream;
  videoElement.className = "w-full h-full object-cover";

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

// ==================================================
// Camera Detection
// ==================================================

async function getCameras() {
  try {
    return await navigator.mediaDevices.enumerateDevices();
  } catch (error) {
    console.error("Error enumerating devices:", error);
    throw error;
  }
}

async function getVideoCameras() {
  const allDevices = await getCameras();

  return allDevices.filter((device) => device.kind === "videoinput");
}

export async function populateCameraList() {
  const cameras = await getVideoCameras();

  cameraList.innerHTML = "";

  if (cameras.length === 0) {
    const option = document.createElement("option");

    option.textContent = "No Cameras Detected";
    option.disabled = true;

    cameraList.appendChild(option);
    return;
  }

  cameras.forEach((camera, index) => {
    const option = document.createElement("option");

    option.value = camera.deviceId;
    option.className = "option-default";
    option.textContent = camera.label || `Camera ${index + 1}`;

    cameraList.appendChild(option);
  });
}

export async function startStream(participantId, cameraDeviceId) {
  const videoElement = document.getElementById(`video-${participantId}`);
  
  if (!videoElement) {
    console.error("Local video element not found!");
    return;
  }
  
  const constraints = {
    video: { deviceId: { exact: cameraDeviceId } },
    audio: false,
  }

  try {
    if (videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach((track) => track.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);      
    videoElement.srcObject = stream; 
  } catch (error) {
    console.error("Stream error:", error);
    alert(`Failed to start camera: ${error.message}`);
  }
}

// ==================================================
// Initialization
// ==================================================

async function initializeCamera() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    alert(
      "This browser does not support camera detection. Please use a modern browser like Chrome, Firefox, or Edge.",
    );
    return;
  }

  console.log("MediaDevices API is supported!");

  await populateCameraList();
  await initLocalVideo();
}

initializeCamera();
