import { stopMedia, getLocalVideoElement } from "./session-camera.js";

const refreshBtn = document.getElementById("refreshBtn");
const mirrorBtn = document.getElementById("mirrorBtn");

let isMirrored = false;

export const mediaStream = null;

muteBtn?.addEventListener("click", () => {
  stopMedia();
});

mirrorBtn?.addEventListener("click", () => {
  isMirrored = !isMirrored;

  mirrorCamera();
});


refreshBtn.addEventListener("click", () => {
  const refreshImg = refreshBtn.querySelector('img');
  refreshImg.classList.toggle('rotate-180');

  
});


function mirrorCamera() {
  const localVideo = getLocalVideoElement();

  if (!localVideo) {
    console.warn("Local video not available.");
    return;
  }

  localVideo.style.transform = isMirrored
    ? "scaleX(-1)"
    : "scaleX(1)";

  const side = isMirrored ? "right" : "left";

  const template = document.createElement("template");

  template.innerHTML = `
    <img
      class="w-5 h-5 invert object-contain brightness-0"
      src="../../static/images/icons/mirror-${side}.svg"
    />
  `.trim();

  mirrorBtn.replaceChildren(template.content.firstElementChild);
}
