from fastapi import APIRouter, HTTPException, Query
import os
from inference_sdk import InferenceHTTPClient
from dotenv import load_dotenv

load_dotenv()

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "i94LnNi2s56rDRRKu60E")  
ROBOFLOW_MODEL_ID = "adr/6"

client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key=ROBOFLOW_API_KEY
)

router = APIRouter()

@router.get("/predict")
def predict(filename: str = Query(...)):

    image_path = os.path.join("app/static/converted", filename)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")

    try:
        prediction = client.infer(image_path, model_id=ROBOFLOW_MODEL_ID)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roboflow prediction failed: {str(e)}")