import { stopMedia, getLocalVideoElement } from "./session-camera.js";

const muteBtn = document.getElementById("muteBtn");
const mirrorBtn = document.getElementById("mirrorBtn");

let mirrorFlag = false;
let side = null;

export const mediaStream = null;

muteBtn?.addEventListener("click", () => {
  stopMedia();
});

mirrorBtn?.addEventListener("click", () => {
  mirrorFlag = !mirrorFlag;
  side = mirrorFlag ? "right" : "left";
  
  mirrorCamera(side);
});

function mirrorCamera(side) {
  const localVideo = getLocalVideoElement();

  if (!localVideo) {
    console.warn("Local video not available.");
    return;
  }

  const invertedMirrorBtn = document.createElement("template");

  invertedMirrorBtn.innerHTML = `
    <img class="w-5 h-5 invert object-contain brightness-0" src="../../static/images/icons/mirror-${side}.svg"/>
  `.trim();

  mirrorBtn.replaceChildren(invertedMirrorBtn.content.firstChild);

  if (localVideo.id) {
    localVideo.style.transform = mirrorFlag ? "scaleX(-1)" : "scaleX(1)";
  }
}
