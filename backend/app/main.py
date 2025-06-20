from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import report, upload, predict
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(predict.router)
app.include_router(report.router)

app.mount("/static", StaticFiles(directory="app/static"), name="static")