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


// NOTE: THIS FUNCTION IS NOT USED AND NOT DELETED FOR FUTURE UPDATE
//       IF TIME COMES WE INCLUDE ABILITY TO TURN OFF CAMERA FOR PARTICIPANTS
//       AGAIN NOTE !!!! NOT REFERENCED TO ANY FILES!!!!

export function stopMedia() {
  if (!mediaStream) return;

  mediaStream.getTracks().forEach((track) => {
    track.stop();
  });

  const localVideo = document.getElementById(
    `video-${participantId}`,
  );

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
  videoElement.className = 'absolute inset-0 w-full h-full object-cover rounded-2xl';

  const videoCount = videoGrid.querySelectorAll('video').length;

  videoElement.style.zIndex = videoCount + 1;

  // Don't play our own microphone back to us
  if (videoParticipantId === participantId) {
    videoElement.muted = true;
  }

  videoGrid.appendChild(videoElement);
}

export function getLocalVideoElement() {

  return document.getElementById(`video-${participantId}`);
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

  return allDevices.filter(
    (device) => device.kind === "videoinput",
  );
}

async function populateCameraList() {
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
    option.textContent =
      camera.label || `Camera ${index + 1}`;

    cameraList.appendChild(option);
  });
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