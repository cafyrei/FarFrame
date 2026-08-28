import { stopMedia } from "./session-camera.js";

const muteBtn = document.getElementById("muteBtn");

export const mediaStream = null;

muteBtn?.addEventListener("click", () => {
  stopMedia();
});
