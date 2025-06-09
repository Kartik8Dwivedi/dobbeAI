# DobbeAI

A dental diagnostics web application that utilizes AI to analyze dental X-ray images. Built with **FastAPI (Python)** for the backend and **Next.js (React)** for the frontend.

---

## 📁 Project Structure

```plaintext
repo-root/
├── Backend/
│   ├── app/
│   │   ├── main.py
│   │   └── routers/
│   │       └── report.py
│   ├── tests/
│   │   └── test_report.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── Frontend/
│   ├── pages/
│   ├── public/
│   ├── components/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### 🐳 Docker Setup (Recommended)

1. Ensure Docker and Docker Compose are installed.

2. From the root directory, run:

```bash
docker-compose up --build
```

3. The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)

---

## 📂 Dockerfile Summary

- **Frontend Dockerfile** uses Node.js to build and serve the Next.js app.
- **Backend Dockerfile** uses Python and installs dependencies via `requirements.txt`.
- `docker-compose.yml` links frontend (port 3000) and backend (port 8000).

---

## 🧪 Running Tests (Backend)

Inside the `Backend/` directory:

```bash
pytest
```

Ensure your Python virtual environment is activated if not using Docker.

---

## 🔧 Manual Setup

### Backend (FastAPI)

1. Navigate to the backend folder:
```bash
cd Backend
```

2. (Optional but recommended) Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

Access the API at: [http://localhost:8000](http://localhost:8000)

### Frontend (Next.js)

1. Navigate to the frontend folder:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Access the frontend at: [http://localhost:3000](http://localhost:3000)

---

## 📩 API Endpoint

### `POST /report`

- Accepts a list of predictions from AI detection
- Returns a textual dental report

Example request:

```json
{
  "predictions": [
    {
      "x": 123,
      "y": 234,
      "width": 56,
      "height": 78,
      "confidence": 0.92,
      "class_id": 1,
      "class_": "Cavity",
      "detection_id": "abc123"
    }
  ]
}
```

---

## ✨ Features

- Upload and analyze dental X-rays
- AI-generated dental report
- REST API with FastAPI
- Responsive frontend using Next.js and Tailwind CSS

---

## 👨‍💻 Developer Notes

- Use `.env` files for API keys or ML services
- Can integrate with Hugging Face, AWS, or other inference services
- Consider deploying frontend with **Vercel** and backend with **Render** or **Fly.io**

---

## 📜 License

MIT License. See `LICENSE` file for details.

---

## 🙌 Contributions

Feel free to fork this repo and submit pull requests!

---

Happy Hacking! 🦷🚀