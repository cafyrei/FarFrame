import { create_room, join_room } from "./room-api.js";
import { showModal, hideModal } from "../utils/modal-utils.js";


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

const create_room_button =
    document.getElementById("create-room-button");

const join_room_button =
    document.getElementById("join-room-button");

const submit_room_code_button =
    document.getElementById("submit-room-code-button");

const copy_room_id_button =
    document.getElementById("copy-room-id-button");

const close_modal_button_create =
    document.getElementById("close-modal-button-create");

const close_modal_button_join =
    document.getElementById("close-modal-button-join");

const fail_modal_button =
    document.getElementById("close-fail-modal-button");


// ==================================================
// Open Join Modal
// ==================================================

join_room_button.addEventListener("click", () => {
    showModal("join-room-modal");
});


// ==================================================
// Create Room
// ==================================================

create_room_button.addEventListener("click", async () => {
    try {
        const room = await create_room();

        // Store the room code
        currentRoomCode = room.room_code;
        participantId = room.participantId;

        // Display it
        room_id.textContent = currentRoomCode;

        showModal("create-room-modal");

    } catch (error) {
        console.error("Error creating room:", error);
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

        hideModal("join-room-modal");

        // Go to lobby
        window.location.href =
            `/lobby?room_code=${encodeURIComponent(currentRoomCode)}&participantId=${encodeURIComponent(participantId)}`;

    } catch (error) {
        showModal("failmodal");
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

    await navigator.clipboard.writeText(currentRoomCode);
});


// ==================================================
// Create Room Modal → Lobby
// ==================================================

close_modal_button_create.addEventListener("click", () => {
    if (!currentRoomCode) {
        return;
    }

    hideModal("create-room-modal");

    window.location.href =
        `/lobby?room_code=${encodeURIComponent(currentRoomCode)}&participantId=${encodeURIComponent(participantId)}`;
});


// ==================================================
// Close Join Modal
// ==================================================

close_modal_button_join.addEventListener("click", () => {
    hideModal("join-room-modal");
});


// ==================================================
// Close Failure Modal
// ==================================================

fail_modal_button.addEventListener("click", () => {
    hideModal("failmodal");
});