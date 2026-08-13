from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, room_code: str):
        
        await websocket.accept()
        
        if room_code not in self.rooms:
            self.rooms[room_code] = []
        
        self.rooms[room_code].append(websocket)
        
        participant_count = len(self.rooms[room_code])
        
        return participant_count
        
    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code in self.rooms:
            if websocket in self.rooms[room_code]:
                self.rooms[room_code].remove(websocket)
                participant_count = len(self.rooms[room_code])

            if not self.rooms[room_code]:
                del self.rooms[room_code]
                
        return participant_count
            
    async def broadcast_to_others(self, message: dict, room_code: str, sender: WebSocket):
        if room_code in self.rooms:    
            for connection in self.rooms[room_code]:
                if connection != sender:
                    await connection.send_json(message)
                    
    async def broadcast_to_anyone(self, message: dict, room_code: str):
        if room_code in self.rooms:    
            for connection in self.rooms[room_code]:
                await connection.send_json(message)
    
