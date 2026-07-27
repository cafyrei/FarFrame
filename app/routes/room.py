from fastapi import APIRouter # FastAPI import for creating API routes

"""Route for creating a new room."""
from app.services.code_generator import generate_room_code

router = APIRouter()

@router.post("/rooms")
def create_room():
    """Create a new room and generate a unique room code."""
    room_code = generate_room_code()
    return {"room_code": room_code}