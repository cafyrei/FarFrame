from app.schemas.roomSchema import JoinRoomRequest

from datetime import datetime, timedelta
from fastapi import HTTPException

import traceback # Debugging: Import traceback for error handling

from app.models.roomModel import Room
from app.services.valueGenerator import generate_room_code, generate_participant_id, generate_avatar_selector
from app.database import SessionLocal

class RoomManager:
    def __init__(self):
        self.rooms = {}

    def create_room(self):
        
        room_code = generate_room_code()
        participantId = generate_participant_id()
        avatar = generate_avatar_selector()
        
        db = SessionLocal()
        
        try:
            room = Room(
                room_code=room_code,
                expires_at= datetime.now() + timedelta(days=3)
                )
        
            db.add(room)
            db.commit()
            db.refresh(room)

            return {
                "room_code": room_code,
                "participantId" : "PID" + participantId,
                "role": "host",
                "avatar": avatar
            }
                
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
        
        participantId = generate_participant_id()
        avatar = generate_avatar_selector()
        
        
        print(participantId)
        
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
                "room_code": room.room_code,
                "participantId" : "PID" + participantId,
                "role" : "guest",
                "avatar": avatar
            }

        finally:
            db.close()       
            
    def room_exists(self, room_code):
        db = SessionLocal()
        try:
            room = (
                db.query(Room)
                .filter(Room.room_code == room_code)
                .first()
            )
            return room is not None
        
        finally:
            db.close()
