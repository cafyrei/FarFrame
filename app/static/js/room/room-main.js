import { create_room, join_room } from "./room-api.js";
import { setRoomCode } from "./room-state.js";
import { showModal, hideModal } from "../utils/modal-utils.js";

//
const room_id = document.getElementById("room-id");
const room_code_input = document.getElementById("room-code-input");

// Event listeners for buttons
const create_room_button = document.getElementById("create-room-button");
const join_room_button = document.getElementById("join-room-button");
const submit_room_code_button = document.getElementById(
  "submit-room-code-button",
);
const fail_modal_button = document.getElementById("close-fail-modal-button");

const errorMsg = document.getElementById("errMsg");

join_room_button.addEventListener("click", () => {
  showModal("join-room-modal");
});

fail_modal_button.addEventListener("click", () => {
  hideModal("failmodal");
});

create_room_button.addEventListener("click", async () => {
  try {
    const room = await create_room();

    setRoomCode(room.room_code);

    room_id.textContent = room.room_code;

    showModal("create-room-modal");
  } catch (error) {
    console.error("Error creating room:", error);
  }
});

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

    setRoomCode(room.room_code);

    hideModal("join-room-modal");
  } catch (error) {
    showModal("failmodal");
    console.error("Error!!!!!!!!!");
  }
});
