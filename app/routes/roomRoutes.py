from app.schemas.roomSchema import JoinRoomRequest
from fastapi import APIRouter, HTTPException
from app.services.roomManager import RoomManager
from app.services.sessionManager import sessionManager

import traceback # Debug Module

router = APIRouter()

# Initialize the Manager Classes
room_manager = RoomManager() # this will manage the rooms and their users

@router.post("/room")
def create_room():
    
    room_information = room_manager.create_room()
    
    sessionManager.add_participant(room_information)

    return room_information

@router.post("/room/join")
def join_room(request: JoinRoomRequest):
    
    try:
        
        guest_information = room_manager.join_room(request)
        
        sessionManager.add_participant(guest_information)
        
        return guest_information
    
    except HTTPException as e:
        raise e
    except Exception as e:
        traceback.print_exc()  # Debugging: Print the traceback to the console
        raise HTTPException(
            status_code=500,
            detail=f"Error joining room: {str(e)}"
        )
        