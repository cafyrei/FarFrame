from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.code_generator import generate_room_code
from app.models.room import Room
from app.database import SessionLocal

router = APIRouter()

# Model for the JSON sent by the frontend
class JoinRoomRequest(BaseModel):
    room_code: str

@router.post("/room")
def create_room():
    room_code = generate_room_code()

    db = SessionLocal()

    try:
        room = Room(room_code=room_code)

        db.add(room)
        db.commit()

        return {
            "room_code": room_code,
        }

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Error creating room: {str(e)}"
        )

    finally:
        db.close()

@router.post("/room/join")
def join_room(request: JoinRoomRequest):
    db = SessionLocal()

    try:
        room = (
            db.query(Room)
            .filter(Room.room_code == request.room_code)
            .first()
        )

        if room is None:
            raise HTTPException(
                status_code=404,
                detail="Room not found",
            )

        return {
            "message": "Joined successfully",
            "room_code": room.room_code,
        }

    finally:
        db.close()