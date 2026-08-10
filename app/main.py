from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routes.room import router as room_router
from app.routes.pages import router as pages_router

app = FastAPI(
    title="Far Frame Booth API",
    description="API for Distant Booth",
    version="0.1.0",
    contact={
        "name": "Allen Alcabaza",
        "email": "allen2talcabaza@gmail.com"
    }
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

templates = Jinja2Templates(directory="app/templates")

@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse(
    request=request,
    name="index.html",
    context={}
)


# Include the routers for /routes folder

app.include_router(room_router)
app.include_router(pages_router)