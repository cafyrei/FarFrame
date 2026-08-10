from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/lobby")
def get_lobby():
    return FileResponse("app/templates/pages/lobby.html")
