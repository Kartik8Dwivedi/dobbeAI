from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.dicom_service import convert_dicom_to_png
import uuid
import os

router = APIRouter()

@router.post("/upload")
async def upload_dicom(file: UploadFile = File(...)):
    if not file.filename.endswith((".dcm", ".rvg")):
        raise HTTPException(status_code=400, detail="Invalid file format. Use .dcm or .rvg")

    # Save the uploaded file temporarily
    temp_filename = f"temp_{uuid.uuid4()}.dcm"
    temp_path = os.path.join("app/static/converted", temp_filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    # Convert to PNG
    png_filename = temp_filename.replace(".dcm", ".png")
    output_path = os.path.join("app/static/converted", png_filename)

    try:
        convert_dicom_to_png(temp_path, output_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return JSONResponse({
        "image_url": f"/static/converted/{png_filename}",
        "filename": png_filename
    })
