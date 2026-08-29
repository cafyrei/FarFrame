import {
  getLocalVideoElement,
  setParticipantMirror,
} from "./session-camera.js";
import { sendMirrorState} from "./session-socket.js";
import { participantId } from "../utils/socket.js";


// DOM INITIALIZATION

const refreshBtn = document.getElementById("refreshBtn");
const mirrorBtn = document.getElementById("mirrorBtn");
const muteBtn = document.getElementById("muteBtn");

// TOGGLE CONTROL DECLARATION

let isMirrored = false;
let isMuted = false;

muteBtn?.addEventListener("click", () => {
  isMuted = !isMuted;

  // Icons and Labels
  const icon = isMuted
    ? "/static/images/icons/mute.svg"
    : "/static/images/icons/unmute.svg";
  const label = isMuted ? "Unmute" : "Mute";

  // Update inner DOM elements safely
  muteBtn.querySelector("p").textContent = label;

  const iconDiv = muteBtn.querySelector("div");
  iconDiv.style.maskImage = `url('${icon}')`;
  iconDiv.style.webkitMaskImage = `url('${icon}')`;
});

mirrorBtn?.addEventListener("click", () => {
  isMirrored = !isMirrored;
  
  // CHANGE OWN CAMERA
  setParticipantMirror(participantId, isMirrored);
  
  // SEND THE MESSAGE TO REMOTE
  sendMirrorState(isMirrored);
  
  // ONLY CHANGE THE ICON INSIDE THE BUTTON OF MIRROR
  const side = isMirrored ? "right" : "left";
  const template = document.createElement("template");

  template.innerHTML = `
    <img
      class="w-5 h-5 invert object-contain brightness-0"
      src="../../static/images/icons/mirror-${side}.svg"
    />
  `.trim();

  mirrorBtn.replaceChildren(template.content.firstElementChild);
});

refreshBtn.addEventListener("click", () => {
  const refreshImg = refreshBtn.querySelector("img");
  refreshImg.classList.toggle("rotate-180");
});
