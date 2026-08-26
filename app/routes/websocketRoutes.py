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
    
    # If that participant is not registered in session manager return
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
    
    existing_participants = connectionManager.get_existing_participants(room_code)
    
    participants_in_session = await connectionManager.connect(websocket, room_code, participant_data)
    
    await connectionManager.unicast_to_new_participant(
        {
            "type": "existing_participants",
            "participants": existing_participants
        },
        sender=websocket
    )
    
    await connectionManager.broadcast_to_anyone(
        {
            "type": "participant_joined",
            "participantId": participantId,
            "role" : participant_data["role"],
            "avatar": participant_data["avatar"],
            "count": participants_in_session,
        },
        room_code
    )
    
    try:
        while True:
            
            # Data fetched from js: lobby-sockets.js
            data = await websocket.receive_json()
            
            match data:
                case {"type": "leave_session"}:
                    participants_in_session = connectionManager.disconnect(websocket, room_code)
                    sessionManager.remove_participant(participantId, room_code)
                    sessionManager.display_data()
                    
                    await connectionManager.broadcast_to_anyone(
                        {
                            "type": "participant_left",
                            "count": participants_in_session,
                            "participantId": participantId
                        },
                        room_code
                    )
                    return
                    
                case {"type": "start_session"}:
                    await connectionManager.broadcast_to_anyone(data, room_code)
                case _:
                    await connectionManager.broadcast_to_others(data, room_code, sender=websocket)
                    
            
    except WebSocketDisconnect:
        
        participants_in_session = connectionManager.disconnect(websocket, room_code)
        
        sessionManager.display_data()
        
        # Let other participant that someone disconnects reducing the count
        await connectionManager.broadcast_to_anyone(
        {
            "type": "participant_disconnected",
            "count": participants_in_session,
            "participantId": participantId
        },
        room_code
    )
    