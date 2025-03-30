// src/pages/[fileId].tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FileMetadata } from '../types'
import { getFileMetadata, validatePassword, downloadFile } from '../utils/api'
import { formatFileSize } from '../utils/helpers'
import useSshModal from '../hooks/useSshModal'
import SshInstructionsModal from '../components/SshInstructionsModal'

// Import Three.js scene with dynamic loading to prevent SSR issues
const Scene = dynamic(() => import('../components/three/Scene'), {
  ssr: false,
  loading: () => <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-950" />
})

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

interface FilePageProps {
  fileMetadata: FileMetadata | null
  error?: string
}

export default function FilePage({ fileMetadata, error: serverError }: FilePageProps) {
  const router = useRouter()
  const { fileId } = router.query
  
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(serverError || null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // SSH modal state
  const { isOpen: isSshModalOpen, openModal: openSshModal, closeModal: closeSshModal } = useSshModal()
  
  // Handle password submission
  const handleSubmitPassword = async () => {
    if (!fileId || !password.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const isValid = await validatePassword(fileId as string, password)
      
      if (isValid) {
        setIsAuthenticated(true)
      } else {
        setError('Invalid password. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Password validation error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle file download
  const handleDownload = async () => {
    if (!fileId || !fileMetadata) return
    
    setDownloading(true)
    
    try {
      const fileBlob = await downloadFile(fileId as string, password)
      
      // Create download link
      const url = URL.createObjectURL(fileBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileMetadata.name
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Error downloading file. Please try again.')
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitPassword()
    }
  }
  
  // If file not found
  if (!fileMetadata) {
    return (
      <div className="min-h-screen">
        <Head>
          <title>File Not Found | SDROP</title>
          <meta name="description" content="File not found or has been removed" />
        </Head>
        
        <Scene />
        
        <div className="container mx-auto px-4 py-20">
          <motion.div 
            className="max-w-lg mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-red-900/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">File Not Found</h1>
            <p className="text-gray-400 mb-8">
              The file you're looking for does not exist or has been removed.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-primary text-gray-900 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen overflow-hidden">
      <Head>
        <title>{fileMetadata.name} | SDROP</title>
        <meta name="description" content="Secure file download with SDROP" />
      </Head>
      
      <Scene />
      
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary w-10 h-10 rounded-xl text-gray-900 text-xl font-bold flex items-center justify-center">
              S
            </div>
            <span className="text-white text-xl font-bold">SDROP</span>
          </Link>
          
          <nav className="flex space-x-4">
            <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
              Documentation
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-20 flex items-center justify-center min-h-screen">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800/20 backdrop-blur-lg border border-gray-700/30 p-6 rounded-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white mb-1">{fileMetadata.name}</h1>
              <p className="text-gray-400 text-sm mb-4">
                {formatFileSize(fileMetadata.size)}
              </p>
            </div>
            
            {!isAuthenticated ? (
              <>
                <p className="text-center text-gray-300 mb-6">
                  This file is password protected. Enter the password to access it.
                </p>
                
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 bg-gray-800/40 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleSubmitPassword}
                  disabled={!password.trim() || loading}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    !password.trim() || loading ? 'bg-gray-800/40 text-gray-400 cursor-not-allowed' : 'bg-primary text-gray-900 hover:bg-primary/90'
                  }`}
                >
                  {loading ? 'Verifying...' : 'Access File'}
                </button>
                
                <div className="mt-6">
                  <button 
                    onClick={openSshModal}
                    className="w-full text-center text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Download with SSH
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-900/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">File Unlocked</h2>
                  <p className="text-gray-400 mb-2">
                    You now have access to this file.
                  </p>
                </div>
                
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`w-full py-3 rounded-lg font-medium mb-4 transition-colors ${
                    downloading ? 'bg-gray-800/40 text-gray-400 cursor-not-allowed' : 'bg-primary text-gray-900 hover:bg-primary/90'
                  }`}
                >
                  {downloading ? 'Downloading...' : 'Download File'}
                </button>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    This link will remain valid for a limited time.
                  </p>
                  
                  <button 
                    onClick={openSshModal}
                    className="text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      SSH
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>
      
      {/* SSH Instructions Modal */}
      {fileId && (
        <SshInstructionsModal 
          isOpen={isSshModalOpen} 
          closeModal={closeSshModal} 
          fileId={fileId as string} 
        />
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fileId } = context.params || {}
  
  if (!fileId || typeof fileId !== 'string') {
    return {
      props: {
        fileMetadata: null,
        error: 'Invalid file ID'
      }
    }
  }
  
  try {
    // Fetch file metadata
    const metadata = await getFileMetadata(fileId)
    
    return {
      props: {
        fileMetadata: {
          ...metadata,
          createdAt: metadata.createdAt.toISOString()
        }
      }
    }
  } catch (error) {
    console.error('Error fetching file metadata:', error)
    
    return {
      props: {
        fileMetadata: null,
        error: 'File not found or has been removed'
      }
    }
  }
}