import { updateRoomId, updateParticipantCount } from "./lobby-main.js";

const test_button = document.getElementById("test-socket");

updateRoomId();

// Setup WebSocket
const room_code = new URLSearchParams(window.location.search).get("room_code");
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(`${protocol}//${window.location.host}/ws/${room_code}`);

socket.onopen = () => {
    console.log("Connected to room:", room_code);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === "user_joined") {
        updateParticipantCount(true);
    } else if (data.type === "user_left") {
        updateParticipantCount(false);
    }
};

test_button?.addEventListener("click", () => {
    socket.send(JSON.stringify({ type: "test", message: "Hello!" }));
});