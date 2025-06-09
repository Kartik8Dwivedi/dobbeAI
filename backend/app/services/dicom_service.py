import pydicom
import numpy as np
from PIL import Image


def convert_dicom_to_png(dicom_path: str, output_path: str):
    ds = pydicom.dcmread(dicom_path)
    img_array = ds.pixel_array

    # Normalize pixel values
    img_array = img_array - np.min(img_array)
    img_array = (img_array / np.max(img_array)) * 255.0
    img_array = img_array.astype(np.uint8)

    img = Image.fromarray(img_array)
    img.save(output_path)