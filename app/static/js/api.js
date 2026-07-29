export async function create_room() {
    const response = await fetch("/room", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

export async function join_room(room_code) {
    const response = await fetch("/room/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_code }),
    });

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}   