from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.code_generator import generate_room_code

router = APIRouter()

# Stores all active rooms
rooms = {}


# Model for the JSON sent by the frontend
class JoinRoomRequest(BaseModel):
    room_code: str


@router.post("/room")
def create_room():
    """Create a new room and return its code."""

    room_code = generate_room_code()

    rooms[room_code] = {
        "host": None,
        "guests": [],
    }

    return {
        "room_code": room_code,
    }

@router.post("/room/join")
def join_room(request: JoinRoomRequest):
    """Join an existing room."""

    room_code = request.room_code

    if room_code not in rooms:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    return {
        "message": "Joined successfully",
        "room": rooms[room_code],
    }