"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileImage, Brain, Eye, Activity, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { uploadFile, predictImage, generateReport } from "@/lib/api"
import { LoadingAnimation } from "@/components/loading-animation"
import { ImageViewer } from "@/components/image-viewer"
import { ReportViewer } from "@/components/report-viewer"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "@/components/ui/use-toast"

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

interface UploadResponse {
  image_url: string
  filename: string
}

interface PredictResponse {
  inference_id: string
  time: number
  image: {
    width: number
    height: number
  }
  predictions: Prediction[]
}

interface ReportResponse {
  report: string
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [report, setReport] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && (file.name.endsWith(".dcm") || file.name.endsWith(".rvg"))) {
      setFile(file)
      setError(null)
      startAnalysisWorkflow(file)
    } else {
      setError("Please upload a valid DICOM file (.dcm or .rvg)")
      toast({
        title: "Invalid File",
        description: "Please upload a valid DICOM file (.dcm or .rvg)",
        variant: "destructive",
      })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/dicom": [".dcm"],
      "application/octet-stream": [".rvg"],
    },
    multiple: false,
  })

  const startAnalysisWorkflow = async (file: File) => {
    try {
      // Step 1: Upload file
      setIsUploading(true)
      setCurrentStep(1)

      const uploadResult = await uploadFile(file)
      setUploadResponse(uploadResult)
      setCurrentStep(2)

      toast({
        title: "Upload Successful",
        description: "DICOM file converted and ready for analysis",
      })

      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 2: Predict/Analyze
      setIsUploading(false)
      setIsAnalyzing(true)
      setCurrentStep(3)

      const predictResult = await predictImage(uploadResult.filename)
      setPredictions(predictResult.predictions)
      setImageSize(predictResult.image)
      setCurrentStep(4)

      toast({
        title: "Analysis Complete",
        description: `Found ${predictResult.predictions.length} potential condition(s)`,
      })

      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 3: Generate Report
      setIsAnalyzing(false)
      setIsGeneratingReport(true)
      setCurrentStep(5)

      const reportResult = await generateReport(predictResult.predictions)
      setReport(reportResult.report)
      setCurrentStep(6)

      toast({
        title: "Report Generated",
        description: "AI diagnostic report is ready",
      })
    } catch (error) {
      console.error("Analysis workflow failed:", error)
      setError("Analysis failed. Please try again.")
      toast({
        title: "Analysis Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setIsAnalyzing(false)
      setIsGeneratingReport(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setUploadResponse(null)
    setPredictions([])
    setReport("")
    setCurrentStep(0)
    setError(null)
  }

  const steps = [
    "Ready to Upload",
    "Uploading File",
    "Converting DICOM",
    "AI Analysis",
    "Detecting Conditions",
    "Generating Report",
    "Analysis Complete",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">DentalAI Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Dental Diagnostics</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Activity className="w-4 h-4 mr-1" />
                System Online
              </Badge>
              <ThemeToggle />
              <Button variant="outline" onClick={resetAnalysis}>
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{steps[currentStep]}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Image */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Dental X-ray (DICOM)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {!uploadResponse ? (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : error
                            ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <input {...getInputProps()} />
                        <div className="space-y-4">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                              error ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-purple-600"
                            }`}
                          >
                            {error ? (
                              <AlertCircle className="w-8 h-8 text-white" />
                            ) : (
                              <FileImage className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-lg font-semibold ${error ? "text-red-900 dark:text-red-200" : "text-gray-900 dark:text-gray-100"}`}
                            >
                              {isDragActive ? "Drop your DICOM file here" : error ? error : "Drag & drop your DICOM file"}
                            </p>
                            {!error && (
                              <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Supports .dcm and .rvg files up to 50MB
                              </p>
                            )}
                          </div>
                          {!error && (
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              Browse Files
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      <ImageViewer
                        imageUrl={uploadResponse.image_url}
                        predictions={predictions}
                        imageSize={imageSize}
                      />

                      {predictions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-3"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Detected Conditions
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {predictions.map((pred, index) => (
                              <motion.div
                                key={pred.detection_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      pred.confidence > 0.8
                                        ? "bg-red-500"
                                        : pred.confidence > 0.6
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                  />
                                  <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
                                    {pred.class}
                                  </span>
                                </div>
                                <Badge variant="secondary">{(pred.confidence * 100).toFixed(1)}%</Badge>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {(isUploading || isAnalyzing) && (
                  <div className="mt-6">
                    <LoadingAnimation isUploading={isUploading} isAnalyzing={isAnalyzing} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Report */}
          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Generated Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-full">
                <AnimatePresence mode="wait">
                  {isGeneratingReport ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-64 space-y-4"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generating Report</p>
                        <p className="text-gray-600 dark:text-gray-400">AI is analyzing the findings...</p>
                      </div>
                    </motion.div>
                  ) : report ? (
                    <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <ReportViewer report={report} predictions={predictions} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-64 space-y-4 text-center"
                    >
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Brain className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ready for Analysis</p>
                        <p className="text-gray-600 dark:text-gray-400">Upload a DICOM file to get started</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
