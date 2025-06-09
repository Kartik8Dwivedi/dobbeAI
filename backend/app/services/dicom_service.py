import pydicom
import numpy as np
from PIL import Image
import os
from uuid import uuid4

def convert_dicom_to_png(dicom_path: str) -> str:
    ds = pydicom.dcmread(dicom_path)

    try:
        pixel_array = ds.pixel_array
    except Exception as e:
        raise RuntimeError(f"Failed to extract pixel array: {e}")

    pixel_array = pixel_array.astype(float)
    normalized = (np.maximum(pixel_array, 0) / pixel_array.max()) * 255.0
    img_array = np.uint8(normalized)

    img = Image.fromarray(img_array)
    img = img.convert("L")

    filename = f"temp_{uuid4()}.png"
    save_path = os.path.join("app/static/converted", filename)
    img.save(save_path)

    return filename