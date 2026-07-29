import { create_room } from "./api.js";
import { join_room } from "./api.js";

const room_id = document.getElementById("room-id");

// Buttons
const create_room_button = document.getElementById("create-room-button");
const join_room_button = document.getElementById("join-room-button");

// Modals
const create_room_modal = document.getElementById("create-room-modal");
const join_room_modal = document.getElementById("join-room-modal");

// Buttons inside modals
const close_modal_button = document.getElementById("close-modal-button");
const submit_room_code_button = document.getElementById(
  "submit-room-code-button",
);

const room_code_input = document.getElementById("room-code-input");

create_room_button.addEventListener("click", async () => {
  const room = await create_room();

  room_id.textContent = room.room_code;
  create_room_modal.style.display = "block";
});

close_modal_button.addEventListener("click", () => {
  create_room_modal.style.display = "none";
});

join_room_button.addEventListener("click", async () => {
  join_room_modal.style.display = "block";
});

submit_room_code_button.addEventListener("click", async () => {
  submit_room_code_button.addEventListener("click", async () => {
    try {
      const room = await join_room(room_code_input.value);

      console.log(room);

      join_room_modal.style.display = "none";
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });
});
