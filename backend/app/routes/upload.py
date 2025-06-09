from fastapi import APIRouter, UploadFile, File, HTTPException
from uuid import uuid4
import os
from app.services.dicom_service import convert_dicom_to_png

router = APIRouter()

@router.post("/upload")
async def upload_dicom(file: UploadFile = File(...)):
    if not file.filename.endswith(".dcm"):
        raise HTTPException(status_code=400, detail="File must be a .dcm file")

    # Save temporary DICOM
    filename = f"temp_{uuid4()}.dcm"
    dicom_path = os.path.join("app/static/converted", filename)

    with open(dicom_path, "wb") as f:
        content = await file.read()
        f.write(content)

    try:
        image_filename = convert_dicom_to_png(dicom_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "image_url": f"/static/converted/{image_filename}",
        "filename": image_filename
    }