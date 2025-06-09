from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload
import os

app = FastAPI(title="Dental X-ray Diagnosis Backend")

# Allow CORS for frontend on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory if not exists
os.makedirs("app/static/converted", exist_ok=True)
os.makedirs("app/static/annotated", exist_ok=True)

# Register routes
app.include_router(upload.router)

# Entry test
@app.get("/")
def root():
    return {"message": "API is working"}