// src/pages/docs.tsx
import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { 
  generateUploadCommand, 
  generateDownloadCommand,
  generateNodeJsExample,
  generatePythonExample,
  getCliUsageExamples
} from '../utils/ssh'
import { copyToClipboard } from '../utils/helpers'

// Import Three.js animations with dynamic loading to prevent SSR issues
const Scene = dynamic(() => import('../components/three/Scene'), {
  ssr: false,
  loading: () => <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-950" />
})

const DocPage = () => {
  const [activeTab, setActiveTab] = useState('cli')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  const handleCopyCode = async (code: string, index: number) => {
    await copyToClipboard(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }
  
  const cliExamples = getCliUsageExamples()
  const nodeJsExample = generateNodeJsExample()
  const pythonExample = generatePythonExample()
  const uploadCommand = generateUploadCommand()
  const downloadCommand = generateDownloadCommand({ fileId: 'abc123' })
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }
  
  return (
    <div className="min-h-screen">
      <Head>
        <title>Documentation | SDROP</title>
        <meta name="description" content="SDROP documentation and API reference" />
      </Head>
      
      <Scene />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary w-10 h-10 rounded-xl text-gray-900 text-xl font-bold flex items-center justify-center">
              S
            </div>
            <span className="text-white text-xl font-bold">SDROP</span>
          </Link>
          
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/docs" className="text-primary font-medium transition-colors">
              Documentation
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-24">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero section */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h1 className="text-4xl font-bold text-white mb-4">SDROP Documentation</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Learn how to use SDROP for secure file sharing through the web interface or command line.
            </p>
          </motion.div>
          
          {/* Documentation content */}
          <motion.div className="bg-gray-800/20 backdrop-blur-lg border border-gray-700/30 rounded-xl overflow-hidden" variants={itemVariants}>
            {/* Tabs */}
            <div className="flex border-b border-gray-700/50">
              <button 
                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'cli' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('cli')}
              >
                Command Line
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'nodejs' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('nodejs')}
              >
                Node.js
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'python' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('python')}
              >
                Python
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'api' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('api')}
              >
                API Reference
              </button>
            </div>
            
            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'cli' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Command Line Usage</h2>
                  <p className="text-gray-300 mb-6">
                    You can use SDROP directly from your terminal with simple curl commands or by installing our CLI tool.
                  </p>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-3">Using curl</h3>
                    
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-white mb-2">Upload a file</h4>
                      <div className="relative">
                        <pre className="bg-gray-900/70 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          {uploadCommand}
                        </pre>
                        <button 
                          className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
                          onClick={() => handleCopyCode(uploadCommand, -2)}
                        >
                          {copiedIndex === -2 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-white mb-2">Download a file</h4>
                      <div className="relative">
                        <pre className="bg-gray-900/70 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          {downloadCommand}
                        </pre>
                        <button 
                          className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
                          onClick={() => handleCopyCode(downloadCommand, -1)}
                        >
                          {copiedIndex === -1 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Using SDROP CLI</h3>
                    
                    <p className="text-gray-300 mb-4">
                      For more convenient usage, install our CLI tool:
                    </p>
                    
                    <div className="relative mb-6">
                      <pre className="bg-gray-900/70 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                        curl -sf https://sdrop.io/install.sh | sh
                      </pre>
                      <button 
                        className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
                        onClick={() => handleCopyCode('curl -sf https://sdrop.io/install.sh | sh', -3)}
                      >
                        {copiedIndex === -3 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    <h4 className="text-md font-medium text-white mb-2">CLI Examples</h4>
                    <ul className="space-y-2 text-gray-300">
                      {cliExamples.map((example, index) => (
                        <li key={index} className="bg-gray-800/40 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <span className="text-gray-400 text-sm">{example.title}:</span>
                            <pre className="text-sm mt-1 text-primary font-mono">$ {example.command}</pre>
                          </div>
                          <button 
                            className="bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
                            onClick={() => handleCopyCode(example.command, index)}
                          >
                            {copiedIndex === index ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                              </svg>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'nodejs' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Node.js Integration</h2>
                  <p className="text-gray-300 mb-6">
                    Integrate SDROP into your Node.js applications for programmatic file sharing.
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-gray-900/70 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                      {nodeJsExample}
                    </pre>
                    <button 
                      className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
                      onClick={() => handleCopyCode(nodeJsExample, 100)}
                    >
                      {copiedIndex === 100 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'python' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Python Integration</h2>
                  <p className="text-gray-300 mb-6">
                    Integrate SDROP into your Python applications for programmatic file sharing.
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-gray-900/70 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                      {pythonExample}
                    </pre>
                    <button 
                      className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
                      onClick={() => handleCopyCode(pythonExample, 101)}
                    >
                      {copiedIndex === 101 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'api' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
                  <p className="text-gray-300 mb-6">
                    Complete API documentation for integrating with SDROP.
                  </p>
                  
                  <div className="space-y-8">
                    {/* Upload API */}
                    <div className="border-b border-gray-700/50 pb-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-green-900/30 text-green-400 text-xs font-semibold px-2.5 py-1 rounded mr-2">POST</span>
                        <code className="text-gray-300 font-mono">/api/upload</code>
                      </div>
                      <p className="text-gray-400 mb-4">Upload a file with password protection.</p>
                      
                      <h4 className="text-white font-medium mb-2">Request Parameters (multipart/form-data)</h4>
                      <table className="w-full text-sm text-left text-gray-400 mb-4">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-800/40">
                          <tr>
                            <th scope="col" className="px-4 py-3 rounded-tl-lg">Parameter</th>
                            <th scope="col" className="px-4 py-3">Type</th>
                            <th scope="col" className="px-4 py-3 rounded-tr-lg">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-gray-800/20">
                            <td className="px-4 py-3 font-medium text-white">file</td>
                            <td className="px-4 py-3">File</td>
                            <td className="px-4 py-3">The file to upload (required)</td>
                          </tr>
                          <tr className="bg-gray-800/10">
                            <td className="px-4 py-3 font-medium text-white">password</td>
                            <td className="px-4 py-3">String</td>
                            <td className="px-4 py-3">Password to protect the file (required)</td>
                          </tr>
                          <tr className="bg-gray-800/20">
                            <td className="px-4 py-3 font-medium text-white">expiry</td>
                            <td className="px-4 py-3">Number</td>
                            <td className="px-4 py-3">Expiry time in days (default: 7)</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <h4 className="text-white font-medium mb-2">Response (application/json)</h4>
                      <pre className="bg-gray-900/50 text-gray-300 p-3 rounded-lg overflow-x-auto text-sm mb-2">
{`{
  "fileId": "abc123",
  "url": "https://sdrop.io/abc123",
  "expiresAt": "2023-08-01T12:00:00Z"
}`}
                      </pre>
                    </div>
                    
                    {/* Download API */}
                    <div className="border-b border-gray-700/50 pb-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-blue-900/30 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded mr-2">POST</span>
                        <code className="text-gray-300 font-mono">/api/files/:fileId/download</code>
                      </div>
                      <p className="text-gray-400 mb-4">Download a file using its ID and password.</p>
                      
                      <h4 className="text-white font-medium mb-2">Request Parameters (application/json)</h4>
                      <table className="w-full text-sm text-left text-gray-400 mb-4">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-800/40">
                          <tr>
                            <th scope="col" className="px-4 py-3 rounded-tl-lg">Parameter</th>
                            <th scope="col" className="px-4 py-3">Type</th>
                            <th scope="col" className="px-4 py-3 rounded-tr-lg">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-gray-800/20">
                            <td className="px-4 py-3 font-medium text-white">password</td>
                            <td className="px-4 py-3">String</td>
                            <td className="px-4 py-3">Password for the file (required)</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <h4 className="text-white font-medium mb-2">Response</h4>
                      <p className="text-gray-400">File content with appropriate Content-Type and Content-Disposition headers</p>
                    </div>
                    
                    {/* File Info API */}
                    <div>
                      <div className="flex items-center mb-3">
                        <span className="bg-yellow-900/30 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded mr-2">GET</span>
                        <code className="text-gray-300 font-mono">/api/files/:fileId</code>
                      </div>
                      <p className="text-gray-400 mb-4">Get information about a file without downloading it.</p>
                      
                      <h4 className="text-white font-medium mb-2">Response (application/json)</h4>
                      <pre className="bg-gray-900/50 text-gray-300 p-3 rounded-lg overflow-x-auto text-sm">
{`{
  "id": "abc123",
  "name": "example.pdf",
  "size": 2621440,
  "type": "application/pdf",
  "createdAt": "2023-07-25T10:30:00Z",
  "expiresAt": "2023-08-01T10:30:00Z",
  "requiresPassword": true,
  "downloadCount": 5
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Additional resources */}
          <motion.div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6" variants={itemVariants}>
            <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 p-6 rounded-xl hover:bg-gray-800/30 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">Need Help?</h3>
              <p className="text-gray-400 mb-4">
                Can't find what you're looking for? Check our frequently asked questions or contact support.
              </p>
              <Link href="/faq" className="text-primary hover:text-primary/80 transition-colors">
                Visit FAQ →
              </Link>
            </div>
            
            <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 p-6 rounded-xl hover:bg-gray-800/30 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">Open Source</h3>
              <p className="text-gray-400 mb-4">
                SDROP is open source. Explore the code, contribute, or report issues on GitHub.
              </p>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                View on GitHub →
              </a>
            </div>
            
            <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 p-6 rounded-xl hover:bg-gray-800/30 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">Security</h3>
              <p className="text-gray-400 mb-4">
                Learn about the security features and best practices when using SDROP for file sharing.
              </p>
              <Link href="/security" className="text-primary hover:text-primary/80 transition-colors">
                Security Guide →
              </Link>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div className="mt-16 pt-8 border-t border-gray-800/50 text-center" variants={itemVariants}>
            <p className="text-gray-500 text-sm">
              SDROP &copy; {new Date().getFullYear()} • Secure file sharing with SSH integration
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

export default DocPage