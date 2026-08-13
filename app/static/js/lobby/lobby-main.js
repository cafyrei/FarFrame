const room_id = document.getElementById("session-code-value");
const number_of_participants = document.getElementById("number-of-participants");

export function updateRoomId() {
    const room_code = new URLSearchParams(window.location.search).get(
        "room_code",
    );
    
    room_id.textContent = room_code;
}

export function updateParticipantCount(joined) {

    const currentCount = parseInt(number_of_participants.textContent, 10) || 0;
    
    const newCount = Math.max(0, currentCount + (joined ? 1 : -1));
    
    number_of_participants.textContent = newCount;
}
