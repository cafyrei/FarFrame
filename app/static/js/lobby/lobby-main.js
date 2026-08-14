const room_id = document.getElementById("session-code-value");
const number_of_participants = document.getElementById("number-of-participants");
const room_code = new URLSearchParams(window.location.search).get("room_code");

export function updateRoomId() {
    room_id.textContent = room_code;
}

export function updateParticipantCount(newCount) {
    number_of_participants.textContent = newCount;
}
