import {create_room} from "./api.js";

const button = document.getElementById("create-room-button");

button.addEventListener("click", async () => {
    const room = await create_room();
    console.log(room);
});