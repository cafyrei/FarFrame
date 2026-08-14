from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from app.services.connectionManager import ConnectionManager
from app.services.roomManager import RoomManager

router = APIRouter()

connectionManager = ConnectionManager()
roomManager = RoomManager()

@router.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):

    if not roomManager.room_exists(room_code):
        await websocket.close()
        return

    participants_in_session = await connectionManager.connect(websocket, room_code)
    
    await connectionManager.broadcast_to_anyone(
        {
            "type": "participant_count",
            "count": participants_in_session
        },
        room_code
    )
    
    # Broadcaast of Data Received from the JavaScript
    try:
        while True:
            
            data = await websocket.receive_json()
            
            if (data.get("type") ==  "start_session"):
                await connectionManager.broadcast_to_anyone(data, room_code)
            else:
                await connectionManager.broadcast_to_others(data, room_code, sender=websocket)
            
    except WebSocketDisconnect:
        participants_in_session = connectionManager.disconnect(websocket, room_code)
        
        await connectionManager.broadcast_to_anyone(
        {
            "type": "participant_count",
            "count": participants_in_session
        },
        room_code
    )
    