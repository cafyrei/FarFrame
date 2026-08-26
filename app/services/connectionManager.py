from fastapi import WebSocket
from app.services.sessionManager import sessionManager

class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[dict]] = {}
        
    def get_existing_participants(self, room_code: str) -> list[dict]:
        """Returns active room participants without their WebSocket objects for JSON serialization."""
        if room_code not in self.rooms:
            return []
        
        return [
            {
                "participantId": p["participantId"],
                "role": p["role"],
                "avatar": p["avatar"],
            }
            for p in self.rooms[room_code]
        ]
        
    async def connect(self, websocket: WebSocket, room_code: str, participant_data: dict):
        await websocket.accept()

        if room_code not in self.rooms:
            self.rooms[room_code] = []

        self.rooms[room_code].append(participant_data)
        return len(self.rooms[room_code])

    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code in self.rooms:
            self.rooms[room_code] = [
                p for p in self.rooms[room_code] if p["websocket"] != websocket
            ]
            
            if not self.rooms[room_code]:
                del self.rooms[room_code]
                return 0
                
            return len(self.rooms[room_code])
        return 0

    async def broadcast_to_others(self, message: dict, room_code: str, sender: WebSocket):
        if room_code in self.rooms:    
            for participant in self.rooms[room_code]:
                if sender != participant["websocket"]:
                    await participant["websocket"].send_json(message)
    
    async def broadcast_to_anyone(self, message: dict, room_code: str):
        if room_code in self.rooms:    
            for participant in self.rooms[room_code]:
                await participant["websocket"].send_json(message)
    
    async def unicast_to_new_participant(self, message: dict, sender: WebSocket):
        await sender.send_json(message)