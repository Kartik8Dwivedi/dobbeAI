"use client"

import { motion } from "framer-motion"
import { Brain, Upload, Zap, FileImage, Activity } from "lucide-react"

interface LoadingAnimationProps {
  isUploading?: boolean
  isAnalyzing?: boolean
}

export function LoadingAnimation({ isUploading, isAnalyzing }: LoadingAnimationProps) {
  if (isUploading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center space-y-6 py-8"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
          <Upload className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="text-center space-y-2">
          <motion.p
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="text-lg font-semibold text-gray-900"
          >
            Processing DICOM file...
          </motion.p>
          <p className="text-gray-600">Converting to viewable format</p>
        </div>

        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    )
  }

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center space-y-6 py-8"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-20 h-20 border-4 border-purple-200 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-2 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
          />
          <Brain className="w-10 h-10 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="text-center space-y-2">
          <motion.p
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-xl font-semibold text-gray-900"
          >
            AI is analyzing your X-ray...
          </motion.p>
          <p className="text-gray-600">Detecting dental conditions and abnormalities</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: FileImage, label: "Processing Image", delay: 0 },
            { icon: Zap, label: "AI Detection", delay: 0.5 },
            { icon: Activity, label: "Analysis", delay: 1 },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: item.delay,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center space-y-2 p-3 bg-purple-50 rounded-lg"
            >
              <item.icon className="w-6 h-6 text-purple-600" />
              <span className="text-xs font-medium text-purple-800">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  return null
}
