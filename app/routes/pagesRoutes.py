from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/home")
def get_session():
    return FileResponse("app/templates/index.html")

@router.get("/lobby")
def get_lobby():
    return FileResponse("app/templates/pages/lobby.html")

@router.get("/session")
def get_session():
    return FileResponse("app/templates/pages/session.html")