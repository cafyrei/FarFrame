const room_id = document.getElementById("session-code-value");

function updateRoomId() {
    const room_code = new URLSearchParams(window.location.search).get(
        "room_code",
    );
    
    room_id.textContent = room_code;
}

updateRoomId();
