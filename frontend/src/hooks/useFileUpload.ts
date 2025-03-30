// src/hooks/useFileUpload.ts
import { useState, useCallback } from 'react'
import { uploadFile } from '../utils/api'

interface FileUploadHook {
  file: File | null
  url: string | null
  password: string
  loading: boolean
  error: string | null
  success: boolean
  isDragging: boolean
  showCopiedTooltip: boolean
  setFile: (file: File | null) => void
  setPassword: (password: string) => void
  handleUpload: () => Promise<void>
  resetState: () => void
  handleDragEvents: {
    onDragEnter: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
  }
  handleCopyUrl: () => Promise<void>
}

export const useFileUpload = (): FileUploadHook => {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [showCopiedTooltip, setShowCopiedTooltip] = useState<boolean>(false)

  // Handle file upload
  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    if (!password.trim()) {
      setError('Please provide a password')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await uploadFile(file, password)
      setUrl(response.url)
      setSuccess(true)
    } catch (err) {
      setError('Error uploading file. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setLoading(false)
    }
  }, [file, password])

  // Reset state for new upload
  const resetState = useCallback(() => {
    setFile(null)
    setUrl(null)
    setPassword('')
    setLoading(false)
    setError(null)
    setSuccess(false)
  }, [])

  // Handle drag events
  const handleDragEvents = {
    onDragEnter: (e: React.DragEvent) => { 
      e.preventDefault()
      setIsDragging(true) 
    },
    onDragLeave: (e: React.DragEvent) => { 
      e.preventDefault()
      setIsDragging(false) 
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault()
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0])
      }
    }
  }

  // Handle copying URL
  const handleCopyUrl = async () => {
    if (url) {
      await navigator.clipboard.writeText(url)
      setShowCopiedTooltip(true)
      setTimeout(() => setShowCopiedTooltip(false), 2000)
    }
  }

  return {
    file,
    url,
    password,
    loading,
    error,
    success,
    isDragging,
    showCopiedTooltip,
    setFile,
    setPassword,
    handleUpload,
    resetState,
    handleDragEvents,
    handleCopyUrl
  }
}

export default useFileUpload