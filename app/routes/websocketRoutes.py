from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from app.services.connectionManager import ConnectionManager
from app.services.roomManager import RoomManager
from app.services.sessionManager import sessionManager

router = APIRouter()

connectionManager = ConnectionManager()
roomManager = RoomManager()

@router.websocket("/ws/{room_code}/{participantId}")
async def websocket_endpoint(websocket: WebSocket, room_code: str, participantId: str):

    # TODO: Consider whether room_exists() is redundant
    # with SessionManager participant validation.
    
    if not roomManager.room_exists(room_code):
        await websocket.close()
        return
    
    if not sessionManager.validate_participant(room_code, participantId):
        await websocket.close(code=1008)
        return

    participant = sessionManager.participants[room_code][participantId]

    participant_data = {
        "participantId": participantId,
        "role": participant["role"],
        "avatar": participant["avatar"],
        "websocket": websocket
    }
    
    print(participant_data)

    participants_in_session = await connectionManager.connect(websocket, room_code, participant_data)
    
    await connectionManager.broadcast_to_anyone(
        {
            "type": "participant_count",
            "count": participants_in_session,
        },
        room_code
    )
    
    # Broadcaast of Data Received from the JavaScript
    try:
        
        await connectionManager.unicast_to_new_participant(
            {
                "type" : "role",
                "role" : participant_data["role"],
                "avatar": participant_data["avatar"]
            }, 
            room_code,
            sender=websocket
        )
        
        while True:
            
            # Data fetched from js: lobby-sockets.js
            data = await websocket.receive_json()
            
            if (data.get("type") == "start_session"):
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
    