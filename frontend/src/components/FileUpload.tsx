// src/components/FileUpload.tsx
import React, { useRef } from 'react'
import { formatFileSize, generateRandomPassword } from '../utils/helpers'
import useFileUpload from '../hooks/useFileUpload'

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
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
  } = useFileUpload()

  const { onDragEnter, onDragLeave, onDragOver, onDrop } = handleDragEvents

  return (
    <div className="w-full rounded-xl bg-gray-800/30 backdrop-blur-md border border-gray-700/30 p-6">
      <h2 className="text-lg font-medium text-white mb-5">Share files securely</h2>
      
      {!success ? (
        <>
          {/* Upload area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-700/50'
            } ${file ? 'bg-gray-800/20' : ''}`}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} className="hidden" />
            
            {file ? (
              <div className="py-2">
                <p className="text-white font-medium mb-1">{file.name}</p>
                <p className="text-gray-300 text-sm">{formatFileSize(file.size)}</p>
                <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300 mt-3">
                  Remove
                </button>
              </div>
            ) : (
              <div className="py-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-300">Drag and drop your file here</p>
                <p className="text-gray-500 text-sm mt-1">or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 px-4 py-2 bg-gray-800/40 text-white text-sm rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  Select file
                </button>
              </div>
            )}
          </div>
          
          {/* Password input */}
          <div className="flex space-x-2 mb-6">
            <input
              type="password"
              placeholder="Password to protect your file"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 w-full px-4 py-3 bg-gray-800/40 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setPassword(generateRandomPassword())}
              className="px-3 py-0 h-12 bg-gray-800/40 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              Generate
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {/* Upload button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              !file || loading ? 'bg-gray-800/40 text-gray-400 cursor-not-allowed' : 'bg-primary text-gray-900 hover:bg-primary/90'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-white mb-1">File uploaded successfully!</p>
            <p className="text-gray-300 text-sm">Share this secure link</p>
          </div>
          
          <div className="relative mb-5">
            <input
              type="text"
              value={url || ''}
              readOnly
              className="w-full px-4 py-3 pr-10 bg-gray-800/40 border border-gray-700/30 rounded-lg text-white font-mono text-sm"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-white"
              onClick={handleCopyUrl}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              
              {showCopiedTooltip && (
                <span className="absolute right-0 top-8 bg-primary text-gray-900 text-xs font-medium px-2 py-1 rounded-lg">
                  Copied!
                </span>
              )}
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="flex-1 py-3 bg-gray-800/40 text-white rounded-lg font-medium hover:bg-gray-700/50 transition-colors"
            >
              Copy link
            </button>
            
            <button
              type="button"
              onClick={resetState}
              className="flex-1 py-3 bg-primary text-gray-900 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              New upload
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default FileUpload