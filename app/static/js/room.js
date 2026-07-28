import {create_room} from "./api.js";

const button = document.getElementById("create-room-button");
const modal = document.getElementById("room-modal");

button.addEventListener("click", async () => {
    const room = await create_room();
    
    document.getElementById("room-id").textContent = room.room_code;
    modal.style.display = "block";  
});

document.getElementById("close-modal-button").addEventListener("click", () => {
    modal.style.display = "none";
});