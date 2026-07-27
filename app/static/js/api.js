export async function create_room() {
    const response = await fetch("/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data;
}