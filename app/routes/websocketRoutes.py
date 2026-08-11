from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from app.services.roomManager import RoomManager
from app.services.connectionManager import ConnectionManager

router = APIRouter()

connectionManager = ConnectionManager()
roomManager = RoomManager()

@router.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):

    if not roomManager.room_exists(room_code):
        await websocket.close()
        return

    await connectionManager.connect(websocket, room_code)

    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")

    except WebSocketDisconnect:
        connectionManager.disconnect(websocket)