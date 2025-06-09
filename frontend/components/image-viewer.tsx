"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Prediction {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
  class_id: number
  detection_id: string
}

interface ImageViewerProps {
  imageUrl: string
  predictions: Prediction[]
  imageSize: { width: number; height: number }
}

export function ImageViewer({ imageUrl, predictions, imageSize }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setContainerSize({ width, height })
    }
  }, [imageUrl])

  useEffect(() => {
    setImageLoaded(false)
    setZoom(1)
    setRotation(0)
  }, [imageUrl])

  const getScaleFactor = () => {
    if (!imageSize.width || !imageSize.height || !containerSize.width || !containerSize.height) {
      return 1
    }

    const scaleX = (containerSize.width - 40) / imageSize.width
    const scaleY = (containerSize.height - 40) / imageSize.height
    return Math.min(scaleX, scaleY, 1)
  }

  const scaleFactor = getScaleFactor()

  const getClassColor = (className: string) => {
    const colors: Record<string, string> = {
      cavity: "#ef4444", // red
      pa: "#f59e0b", // amber
      cyst: "#8b5cf6", // violet
      fracture: "#06b6d4", // cyan
      default: "#10b981", // emerald
    }
    return colors[className] || colors.default
  }

  // Construct the full image URL - handle both relative and absolute URLs
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}${imageUrl}`

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-2">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.25))} disabled={zoom >= 3}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden" style={{ height: "400px" }}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              transform: `scale(${zoom * scaleFactor}) rotate(${rotation}deg)`,
              transition: "transform 0.3s ease",
              opacity: imageLoaded ? 1 : 0,
            }}
          >
            <img
              src={fullImageUrl || "/placeholder.svg"}
              alt="Dental X-ray"
              className="max-w-none"
              style={{
                width: imageSize.width || "auto",
                height: imageSize.height || "auto",
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error("Image failed to load:", fullImageUrl)
                setImageLoaded(true)
              }}
            />

            {/* Prediction Overlays */}
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.detection_id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="absolute border-2 rounded"
                style={{
                  left: prediction.x - prediction.width / 2,
                  top: prediction.y - prediction.height / 2,
                  width: prediction.width,
                  height: prediction.height,
                  borderColor: getClassColor(prediction.class),
                  boxShadow: `0 0 0 1px rgba(0,0,0,0.3), inset 0 0 0 1px ${getClassColor(prediction.class)}`,
                }}
              >
                <div
                  className="absolute -top-8 left-0 px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap"
                  style={{ backgroundColor: getClassColor(prediction.class) }}
                >
                  {prediction.class} ({Math.round(prediction.confidence * 100)}%)
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
