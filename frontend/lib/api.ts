import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

export interface UploadResponse {
  image_url: string
  filename: string
}

export interface Prediction {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
  class_id: number
  detection_id: string
}

export interface PredictResponse {
  inference_id: string
  time: number
  image: {
    width: number
    height: number
  }
  predictions: Prediction[]
}

export interface ReportResponse {
  report: string
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  console.log("Upload response:", response.data)
  if (!response.data?.image_url || !response.data?.filename) {
    throw new Error("Invalid response from upload endpoint")
  }

  return response.data
}

export const predictImage = async (filename: string): Promise<PredictResponse> => {
  const response = await api.get("/predict", {
    params: { filename },
  })

  console.log("Predict response:", response.data)
  if (!response.data?.inference_id || !response.data?.predictions) {
    throw new Error("Invalid response from predict endpoint")
  }

  return response.data
}

export const generateReport = async (predictions: Prediction[]): Promise<ReportResponse> => {
  try {
    const response = await api.post("/report", { predictions });
    console.log("Report response:", response.data);
    if (!response.data?.report) {
      throw new Error("Invalid response from report endpoint");
    }

    return response.data;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report");
  }
}
