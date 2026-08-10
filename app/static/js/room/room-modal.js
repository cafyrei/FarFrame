import { getRoomCode } from "./room-state.js";  

// Close Modal Button
const close_modal_button_create = document.getElementById(
  "close-modal-button-create",
);
const close_modal_button_join = document.getElementById(
  "close-modal-button-join",
);

const copy_room_id_button = document.getElementById("copy-room-id-button");

const create_room_modal = document.getElementById("create-room-modal");
const join_room_modal = document.getElementById("join-room-modal");

copy_room_id_button.addEventListener("click", async () => {
  const roomCode = getRoomCode();

  if (!roomCode) {
    return;
  }

  await navigator.clipboard.writeText(roomCode);
});

close_modal_button_create.addEventListener("click", () => {
  create_room_modal.style.display = "none";

  // room-modal.js
window.location.href = `/lobby?room_code=${encodeURIComponent(getRoomCode())}`;
// room-modal.js, before redirect
console.log("redirecting with:", getRoomCode());
});

close_modal_button_join.addEventListener("click", () => {
  join_room_modal.style.display = "none";
});
