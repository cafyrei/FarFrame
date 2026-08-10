

from app.schemas.room import JoinRoomRequest

from datetime import datetime, timedelta
from fastapi import HTTPException

import traceback # Debugging: Import traceback for error handling

from app.models.room import Room
from app.services.code_generator import generate_room_code
from app.database import SessionLocal

class RoomManager:
    def __init__(self):
        self.rooms = {}

    def create_room(self):
        
        room_code = generate_room_code()
        
        db = SessionLocal()
        
        try:
            room = Room(
                room_code=room_code,
                expires_at= datetime.now() + timedelta(days=3)
                )
        
            db.add(room)
            db.commit()
            db.refresh(room)

            return room.room_code
        
        except Exception as e:
            db.rollback()
    
            traceback.print_exc()  # Debugging: Print the traceback to the console
            
            raise HTTPException(
                status_code=500,
                detail=f"Error creating room: {str(e)}"
            )
        
        finally:
            db.close()
                
    def join_room(self, request: JoinRoomRequest):
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
         

    def leave_room(self, room_id, user):
        pass

    def get_users_in_room(self, room_id):
        pass