// src/pages/index.tsx
import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import FileUpload from '../components/FileUpload'

// Import Three.js animations with dynamic loading to prevent SSR issues
const Scene = dynamic(() => import('../components/three/Scene'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 w-screen h-screen -z-10 bg-gray-950" />
})

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
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

export default function Home() {
  // State will be used in the future to store recent uploads from backend
  const [recentUploads, setRecentUploads] = useState([])
  
  return (
    <div className="relative">
      {/* Animated Background */}
      <Scene />
      
      <Head>
        <title>SDROP - Secure File Sharing</title>
        <meta name="description" content="Password-protected file sharing with SSH integration" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-sm border-b border-gray-800/30">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="bg-primary w-10 h-10 rounded-xl text-gray-900 text-xl font-bold flex items-center justify-center"
                animate={{ 
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 5, 
                  ease: "easeInOut" 
                }}
              >
                S
              </motion.div>
              <span className="text-white text-xl font-bold">SDROP</span>
            </motion.div>

            <nav className="flex items-center space-x-4">
              <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-4xl mx-auto w-full text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div className="mb-12" variants={itemVariants}>
              <div className="inline-flex items-center justify-center mb-6">
                <motion.div 
                  className="bg-primary w-16 h-16 rounded-xl text-gray-900 text-2xl font-bold flex items-center justify-center glow hover-scale-3d"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  S
                </motion.div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                <span className="text-white">Secure</span>
                <span className="text-primary text-gradient ml-2">file sharing</span>
              </h1>
              
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
                Password-protected file sharing with SSH integration. Easy to use, 
                secure by design, and accessible from anywhere.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 px-4 py-2 rounded-lg">
                  <code className="text-primary">$ curl sdrop.io/upload -F file=@myfile.pdf</code>
                </div>
              </div>
            </motion.div>

            {/* File Upload Component */}
            <motion.div 
              className="w-full max-w-md mx-auto backdrop-blur-sm"
              variants={itemVariants}
            >
              <FileUpload />
            </motion.div>

            {/* Features Section */}
            <motion.div 
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={itemVariants}
            >
              <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 p-6 rounded-xl hover:bg-gray-800/30 transition-colors">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Password Protection</h3>
                <p className="text-gray-400">Each file is protected with a password you choose or one we generate for you.</p>
              </div>

              <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 p-6 rounded-xl hover:bg-gray-800/30 transition-colors">
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">End-to-End Encryption</h3>
                <p className="text-gray-400">Files are encrypted in transit and at rest, ensuring your data remains secure.</p>
              </div>

              <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 p-6 rounded-xl hover:bg-gray-800/30 transition-colors">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">SSH Integration</h3>
                <p className="text-gray-400">Power users can upload and download files directly from the terminal using SSH commands.</p>
              </div>
            </motion.div>
          </motion.div>
        </main>

        <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800/30">
          <div className="container mx-auto">
            <p>SDROP &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}