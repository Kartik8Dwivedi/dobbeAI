"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle, FileText, Download, Share, Activity, Mail, Printer, Copy } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
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

interface ReportViewerProps {
  report: string
  predictions: Prediction[]
}

export function ReportViewer({ report, predictions }: ReportViewerProps) {
  const getSeverityLevel = (predictions: Prediction[]) => {
    const highConfidencePredictions = predictions.filter((p) => p.confidence > 0.8)
    if (highConfidencePredictions.length > 0) return "high"
    if (predictions.length > 0) return "medium"
    return "low"
  }

  const severity = getSeverityLevel(predictions)

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800"
      default:
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800"
    }
  }

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case "high":
        return AlertTriangle
      case "medium":
        return AlertTriangle
      default:
        return CheckCircle
    }
  }

  const SeverityIcon = getSeverityIcon(severity)

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([report], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `dental-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Report Downloaded",
      description: "The diagnostic report has been saved to your device.",
    })
  }

  const handleExportPDF = () => {
    // Simulate PDF export
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be available soon.",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Dental AI Report",
          text: report,
        })
        toast({
          title: "Report Shared",
          description: "The report has been shared successfully.",
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(report)
      toast({
        title: "Copied to Clipboard",
        description: "The report has been copied to your clipboard.",
      })
    }
  }

  const handleEmail = () => {
    const subject = encodeURIComponent("Dental AI Diagnostic Report")
    const body = encodeURIComponent(report)
    window.open(`mailto:?subject=${subject}&body=${body}`)

    toast({
      title: "Email Client Opened",
      description: "Your default email client has been opened with the report.",
    })
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Dental AI Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, h2, h3 { color: #333; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Dental AI Diagnostic Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div>${report.replace(/\n/g, "<br>")}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()

      toast({
        title: "Print Dialog Opened",
        description: "The report is ready to print.",
      })
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report)
    toast({
      title: "Report Copied",
      description: "The diagnostic report has been copied to your clipboard.",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Diagnostic Report</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generated {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Severity Alert */}
      <Card className={`border-2 ${getSeverityColor(severity)}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <SeverityIcon className="w-6 h-6" />
            <div>
              <p className="font-semibold capitalize">{severity} Priority Findings</p>
              <p className="text-sm opacity-80">
                {predictions.length} condition{predictions.length !== 1 ? "s" : ""} detected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Findings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Detected Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.detection_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    prediction.confidence > 0.8
                      ? "bg-red-500"
                      : prediction.confidence > 0.6
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                />
                <div>
                  <p className="font-medium capitalize text-gray-900 dark:text-gray-100">{prediction.class}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Position: ({Math.round(prediction.x)}, {Math.round(prediction.y)})
                  </p>
                </div>
              </div>
              <Badge variant={prediction.confidence > 0.8 ? "destructive" : "secondary"} className="font-semibold">
                {(prediction.confidence * 100).toFixed(1)}%
              </Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* AI Report with Markdown Rendering */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>AI Analysis Report</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="prose prose-sm max-w-none dark:prose-invert"
          >
            <MarkdownRenderer content={report} />
          </motion.div>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Important Notice</p>
              <p>
                This AI-generated report is for diagnostic assistance only. Please consult with a qualified dental
                professional for final diagnosis and treatment planning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
