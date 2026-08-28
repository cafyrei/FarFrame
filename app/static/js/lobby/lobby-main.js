import { participantId } from "../utils/socket.js";
import { triggerToast } from "../utils/toast-utils.js";

const room_id = document.getElementById("session-code-value");
const number_of_participants = document.getElementById(
  "number-of-participants",
);
const room_code = new URLSearchParams(window.location.search).get("room_code");

export function updateRoomId() {
  room_id.value = room_code;
}

export function updateParticipantCount(newCount) {
  number_of_participants.textContent = newCount;
}

// Buttons
const copyRoomBtn = document.getElementById("copy-room-id-button");

// Containers

const roleBtnContainer = document.getElementById("role-container");

copyRoomBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(room_code);
    triggerToast("Room Code saved to clipboard", "copied");
  } catch (error) {
    console.error("Failed to copy:", error);
  }
});

export function createParticipantCard(roleText, randomIcon, participantId) {

  if (document.getElementById(participantId)) return;

  const template = document.createElement("template");
  template.innerHTML = `
    <div id="${participantId}" class="relative flex flex-col items-center animate-fade-in">
      <div class="w-18 h-18 rounded-full bg-[#f7eeec] border-2 border-[#f16c90] flex items-center justify-center p-2 shadow-sm">
        <img class="w-14 h-14 object-contain" src="../../static/images/visuals/avatar/${randomIcon}.png" alt="avatar-icon" />
      </div>
      <span class="px-2 py-1 text-white bg-[#f16c90] rounded-full text-xs font-medium uppercase font-basic absolute top-16">
        ${roleText}
      </span>
    </div>
  `.trim();

  document
    .getElementById("participant-avatar")
    .appendChild(template.content.firstElementChild);
}

export function removeParticipantCard(particiapantId) {
  document.getElementById(particiapantId).remove();
}

export function buttonAssignments(role, joinedParticipant, myParticipantId) {

  if(role !== 'host' || joinedParticipant !== myParticipantId) return;

  const hostTemplate = document.createElement("template");

  hostTemplate.innerHTML = `
    <div id="start-btn" class="flex flex-col text-center justify-center items-center">
      <button
        id="startBtn"
        class="primary-btn font-basic tracking-wider px-12 py-3 text-md font-semibold animate-grow cursor-pointer">
          Start Session
      </button>
    </div>
  `.trim();

  if (role === "host") {
    roleBtnContainer.replaceChildren(hostTemplate.content.firstChild);
  }
}
