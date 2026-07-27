from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routes.room import router

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
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(router)