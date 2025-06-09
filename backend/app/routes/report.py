from fastapi import APIRouter, HTTPException, Request
import requests

router = APIRouter()

@router.post("/report")
async def generate_report(request: Request):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON request")

    predictions = body.get("predictions", [])

    prompt = "Generate a patient-friendly diagnostic report based on the dental X-ray predictions.\n\n"

    if isinstance(predictions, list) and predictions:
        for pred in predictions:
            label = pred.get("class", "unknown")
            confidence = pred.get("confidence", 0)
            try:
                confidence_pct = float(confidence) * 100
            except Exception:
                confidence_pct = 0.0
            prompt += f"- {label} detected with {confidence_pct:.2f}% confidence\n"
    else:
        prompt += "- No specific abnormalities detected or predictions missing.\n"

    prompt += "\nProvide a brief, patient-friendly summary."

    try:
        response = requests.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDg0cA59E80IzPTwjvz2r8UTk0xcF_yHPY",
            headers={"Content-Type": "application/json"},
            json={
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ]
            }
        )

        if response.status_code != 200:
            raise Exception(response.text)

        result = response.json()
        content = result["candidates"][0]["content"]["parts"][0]["text"]
        return {"report": content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")
