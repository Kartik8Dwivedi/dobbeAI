import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_generate_report_success():
    response = client.post("/report", json={
        "predictions": [
            {
                "x": 100,
                "y": 200,
                "width": 50,
                "height": 50,
                "confidence": 0.92,
                "class_id": 0,
                "class": "cavity",
                "detection_id": "abc-123"
            }
        ]
    })
    assert response.status_code == 200
    assert "report" in response.json()

def test_generate_report_empty():
    response = client.post("/report", json={"predictions": []})
    assert response.status_code == 200
    assert response.json()["detail"] == "No predictions provided"

def test_generate_report_missing_predictions():
    response = client.post("/report", json={})
    assert response.status_code in [200, 400]  