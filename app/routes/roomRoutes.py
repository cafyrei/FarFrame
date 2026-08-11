from app.schemas.room import JoinRoomRequest

from fastapi import APIRouter, HTTPException

import traceback # Debug Module

from app.services.roomManager import RoomManager

router = APIRouter()

# Initialize the RoomManager
room_manager = RoomManager() # this will manage the rooms and their users

@router.post("/room")
def create_room():
    room_code = room_manager.create_room()
    
    return {
        "room_code": room_code,
    }

@router.post("/room/join")
def join_room(request: JoinRoomRequest):
    
    try:        
        return room_manager.join_room(request)
    
    except HTTPException as e:
        raise e
    except Exception as e:
        traceback.print_exc()  # Debugging: Print the traceback to the console
        raise HTTPException(
            status_code=500,
            detail=f"Error joining room: {str(e)}"
        )
        