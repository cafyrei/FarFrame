import { participantId } from "../utils/socket.js";

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

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  } catch (error) {
    console.error("Error enumerating devices:", error);
    throw error; // Re-throw to handle upstream
  }
}

async function getVideoCameras(){
  const allDevices = await getCameras();
  
  const cameras = allDevices.filter(device => device.kind === "videoinput");
  return cameras;
}

async function populateCameraList(){
  const cameraList = document.getElementById('cameraList');
  const cameras = await getVideoCameras();

  cameraList.innerHTML = '';
  
  if(cameras.length === 0) {
    const option = document.createElement('option');
    option.textContent = "No Cameras Detected";
    option.disabled = true;
    cameraList.appendChild(option);
    return;
  }

  cameras.forEach(camera => {
    const option = document.createElement('option');
    option.value = camera.deviceId;
    option.className = 'option-default';

    option.textContent = camera.label || `Camera ${cameraList.options.length + 1}`;
    cameraList.appendChild(option);
  });
}

// CHECK IF THE USERS BROWSER SUPPORT CAMERA DETECTION
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  alert(
    "This browser does not support camera detection. Please use a modern browser like Chrome, Firefox, or Edge.",
  );
} else {
  console.log("MediaDevices API is supported!");
}

populateCameraList();