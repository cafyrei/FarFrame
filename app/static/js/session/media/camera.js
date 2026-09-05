import { participantId } from "../../utils/socket.js";
import { addParticipantVideo, getLocalVideoElement } from "./video.js";

// ==================================================
// DOM Elements
// ==================================================

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

export function getLocalMediaStream() {
  return mediaStream;
}

export async function initLocalVideo(myPosition) {
  const stream = await startMedia();

  if (stream) {
    addParticipantVideo(participantId, stream, myPosition);
  }

  return stream;
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

// ==================================================
// Camera Switching
// ==================================================

export async function startStream(cameraDeviceId) {
  const videoElement = getLocalVideoElement();

  if (!videoElement) {
    console.error("Local video element not found.");
    return null;
  }

  const constraints = {
    video: {
      deviceId: { exact: cameraDeviceId },
    },
    audio: false,
  };

  try {
    const oldStream = videoElement.srcObject;

    const newStream = await navigator.mediaDevices.getUserMedia(constraints);

    const newVideoTrack = newStream.getVideoTracks()[0];

    // Change local preview
    videoElement.srcObject = newStream;

    // Stop old camera
    if (oldStream) {
      oldStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }

    // RTC layer can use this
    return newVideoTrack;
  } catch (error) {
    console.error("Stream error:", error);
    alert(`Failed to start camera: ${error.message}`);

    return null;
  }
}

// ==================================================
// Initialization
// ==================================================

export async function initializeCamera() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    alert(
      "This browser does not support camera detection. Please use a modern browser like Chrome, Firefox, or Edge.",
    );
    return;
  }

  console.log("MediaDevices API is supported!");

  await populateCameraList();
}

initializeCamera();
