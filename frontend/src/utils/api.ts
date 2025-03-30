// src/utils/api.ts
import { FileMetadata, UploadResponse } from '../types'

// Base API URL - will be set from environment variables in production
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Generic fetch wrapper with error handling
const fetcher = async <T>(
  url: string, 
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'An error occurred')
    }
    
    return await response.json()
  } catch (error) {
    console.error('API error:', error)
    throw error
  }
}

// Upload a file with password protection
export const uploadFile = async (
  file: File, 
  password: string
): Promise<UploadResponse> => {
  // For the demo, we'll simulate an API response
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real implementation, you would use FormData
  // const formData = new FormData()
  // formData.append('file', file)
  // formData.append('password', password)
  
  // return fetcher<UploadResponse>('/upload', {
  //   method: 'POST',
  //   body: formData,
  //   headers: {} // Let browser set content-type for FormData
  // })
  
  // Simulated response
  const fileId = Math.random().toString(36).substring(2, 10)
  
  return {
    fileId,
    url: `${window.location.origin}/${fileId}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}

// Get file metadata by ID
export const getFileMetadata = async (fileId: string): Promise<FileMetadata> => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Normally would be:
  // return fetcher<FileMetadata>(`/files/${fileId}`)
  
  // Simulated response for now
  return {
    id: fileId,
    name: 'example-file.pdf',
    size: 1024 * 1024 * 2.5, // 2.5 MB
    type: 'application/pdf',
    createdAt: new Date(),
    requiresPassword: true,
    downloadCount: 0
  }
}

// Validate password for a file
export const validatePassword = async (
  fileId: string, 
  password: string
): Promise<boolean> => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // For demo, any non-empty password is valid
  return password.trim().length > 0
  
  // Real implementation would be:
  // try {
  //   await fetcher(`/files/${fileId}/validate`, {
  //     method: 'POST',
  //     body: JSON.stringify({ password })
  //   })
  //   return true
  // } catch {
  //   return false
  // }
}

// Download a file with password
export const downloadFile = async (
  fileId: string, 
  password: string
): Promise<Blob> => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Real implementation would be:
  // const response = await fetch(`${API_URL}/files/${fileId}/download`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ password })
  // })
  
  // if (!response.ok) throw new Error('Download failed')
  // return await response.blob()
  
  // For demo, return a dummy file
  return new Blob(['This is a simulated file download from SDROP'], { 
    type: 'text/plain' 
  })
}

// Get SSH command for file upload
export const getSSHCommand = (fileId: string): string => {
  return `curl -X POST -F "file=@/path/to/file" -F "password=your-password" ${API_URL}/upload`
}

// Get SSH command for file download
export const getSSHDownloadCommand = (fileId: string): string => {
  return `curl -X POST -H "Content-Type: application/json" -d '{"password":"your-password"}' ${API_URL}/files/${fileId}/download -o filename`
}