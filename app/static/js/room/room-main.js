import { create_room, join_room } from "./room-api.js";
import { showElement, hideElement } from "../utils/element-utils.js";
import { triggerToast } from "../utils/toast-utils.js";

// ==================================================
// State
// ==================================================

let currentRoomCode = null;
let participantId = null;

// ==================================================
// HTML Elements
// ==================================================

const room_id = document.getElementById("room-id");
const room_code_input = document.getElementById("room-code-input");
const errorMsg = document.getElementById("errMsg");

// ==================================================
// Buttons
// ==================================================

const create_room_button = document.getElementById("create-room-button");

const join_room_button = document.getElementById("join-room-button");

const submit_room_code_button = document.getElementById(
  "submit-room-code-button",
);

const copy_room_id_button = document.getElementById("copy-room-id-button");

const start_session_button = document.getElementById("start-session-button");

const close_modal = document.getElementById("close-modal-button-create");

const close_toast_button = document.getElementById("close-toast-button");

// ==================================================
// Open Join Modal
// ==================================================

join_room_button.addEventListener("click", () => {
  showElement("join-room-container");
});

// ==================================================
// Create Room
// ==================================================

create_room_button.addEventListener("click", async () => {
  if (currentRoomCode !== null) {
    showElement("create-room-modal");
    return;
  }

  try {
    create_room_button.disabled = true;
    create_room_button.innerText = "Processing...";

    const room = await create_room();

    // Store the room code
    currentRoomCode = room.room_code;
    participantId = room.participantId;

    // Display it
    room_id.value = currentRoomCode;

    showElement("create-room-modal");
  } catch (error) {
    console.error("Error creating room:", error);
  } finally {
    create_room_button.disabled = false;
    create_room_button.innerText = "Create Room";
  }
});

// ==================================================
// Join Room
// ==================================================

submit_room_code_button.addEventListener("click", async (event) => {
  const code = room_code_input.value.trim();

  if (code === "") {
    errorMsg.textContent = "This field cannot be empty";
    event.preventDefault();
    return;
  }

  errorMsg.textContent = "";

  try {
    const room = await join_room(code);

    // Store joined room
    currentRoomCode = room.room_code;
    participantId = room.participantId;

    // console.log(participantId);

    hideElement("join-room-container");

    // Go to lobby
    window.location.href = `/lobby?room_code=${encodeURIComponent(currentRoomCode)}&participantId=${encodeURIComponent(participantId)}`;
  } catch (error) {
    triggerToast("Room code is invalid");
    console.error("Error joining room:", error);
  }
});

// ==================================================
// Copy Room Code
// ==================================================

copy_room_id_button.addEventListener("click", async () => {
  if (!currentRoomCode) {
    return;
  }

  try {
    await navigator.clipboard.writeText(currentRoomCode);
    triggerToast("Room Code saved to clipboard", "copied");
  } catch (error) {
    console.error("Failed to copy:", error);
  }
});

// ==================================================
// Create Room Modal → Lobby
// ==================================================

start_session_button.addEventListener("click", () => {
  if (!currentRoomCode) {
    return;
  }

  hideElement("create-room-modal");

  window.location.href = `/lobby?room_code=${encodeURIComponent(currentRoomCode)}&participantId=${encodeURIComponent(participantId)}`;
});

// ==================================================
// Close Buttons
// ==================================================
close_toast_button.addEventListener("click", () => {
  hideElement("toast-error");
});

close_modal.addEventListener("click", () => {
  hideElement("create-room-modal");
});
