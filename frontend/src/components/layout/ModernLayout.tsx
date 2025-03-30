import React, { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

const ModernLayout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'SDROP - Secure File Sharing',
  description = 'Password-protected file sharing with SSH integration'
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <header className="fixed w-full z-50 backdrop-blur-sm bg-black/30 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl">SDROP</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
              Documentation
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
              Login
            </button>
            <button className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <span className="font-bold text-xl">SDROP</span>
              </div>
              <p className="text-gray-400 mb-4">
                A modern, secure file sharing platform with password protection and SSH integration.
              </p>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} SDROP. All rights reserved.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ModernLayout