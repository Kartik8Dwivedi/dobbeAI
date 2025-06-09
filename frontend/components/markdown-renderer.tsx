"use client"

import { motion } from "framer-motion"
import type React from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    // Split by lines for processing
    const lines = text.split("\n")
    const elements: React.JSX.Element[] = []
    let currentIndex = 0

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (!trimmedLine) {
        elements.push(<br key={`br-${index}`} />)
        return
      }

      // Headers
      if (trimmedLine.startsWith("###")) {
        elements.push(
          <motion.h3
            key={`h3-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentIndex * 0.1 }}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3"
          >
            {trimmedLine.replace(/^###\s*/, "")}
          </motion.h3>,
        )
        currentIndex++
      } else if (trimmedLine.startsWith("##")) {
        elements.push(
          <motion.h2
            key={`h2-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentIndex * 0.1 }}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-4"
          >
            {trimmedLine.replace(/^##\s*/, "")}
          </motion.h2>,
        )
        currentIndex++
      } else if (trimmedLine.startsWith("#")) {
        elements.push(
          <motion.h1
            key={`h1-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentIndex * 0.1 }}
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4"
          >
            {trimmedLine.replace(/^#\s*/, "")}
          </motion.h1>,
        )
        currentIndex++
      }
      // Bold text
      else if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
        elements.push(
          <motion.p
            key={`bold-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentIndex * 0.1 }}
            className="font-bold text-gray-900 dark:text-gray-100 mb-3"
          >
            {trimmedLine.replace(/^\*\*|\*\*$/g, "")}
          </motion.p>,
        )
        currentIndex++
      }
      // List items
      else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        elements.push(
          <motion.li
            key={`li-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: currentIndex * 0.1 }}
            className="text-gray-700 dark:text-gray-300 mb-2 ml-4 list-disc"
          >
            {renderInlineMarkdown(trimmedLine.replace(/^[-*]\s*/, ""))}
          </motion.li>,
        )
        currentIndex++
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        elements.push(
          <motion.li
            key={`oli-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: currentIndex * 0.1 }}
            className="text-gray-700 dark:text-gray-300 mb-2 ml-4 list-decimal"
          >
            {renderInlineMarkdown(trimmedLine.replace(/^\d+\.\s*/, ""))}
          </motion.li>,
        )
        currentIndex++
      }
      // Regular paragraphs
      else {
        elements.push(
          <motion.p
            key={`p-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentIndex * 0.1 }}
            className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed"
          >
            {renderInlineMarkdown(trimmedLine)}
          </motion.p>,
        )
        currentIndex++
      }
    })

    return elements
  }

  const renderInlineMarkdown = (text: string) => {
    // Handle bold text within paragraphs
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-gray-900 dark:text-gray-100">
            {part.replace(/^\*\*|\*\*$/g, "")}
          </strong>
        )
      }
      // Handle italic text
      if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
        return (
          <em key={index} className="italic">
            {part.replace(/^\*|\*$/g, "")}
          </em>
        )
      }
      return part
    })
  }

  return <div className="space-y-2">{renderMarkdown(content)}</div>
}
