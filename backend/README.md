# File Structure

    backend/
    ├── app/
    │   ├── main.py              # Entry point
    │   ├── routes/
    │   │   ├── upload.py       # /upload endpoint
    │   ├── services/
    │   │   ├── dicom_service.py # Convert DICOM to PNG
    │   ├── static/             # Store PNG and annotated images
    └── requirements.txt