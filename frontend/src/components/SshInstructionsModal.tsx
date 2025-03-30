// src/components/SshInstructionsModal.tsx
import React, { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { copyToClipboard } from '../utils/helpers'

interface SshInstructionsModalProps {
  isOpen: boolean
  closeModal: () => void
  fileId: string
}

const SshInstructionsModal: React.FC<SshInstructionsModalProps> = ({
  isOpen,
  closeModal,
  fileId
}) => {
  const [activeTab, setActiveTab] = useState<'curl' | 'cli'>('curl')
  const [copied, setCopied] = useState<boolean>(false)
  
  // Generate commands for specific fileId
  const curlCommand = `curl -X POST https://sdrop.io/api/files/${fileId}/download \\
  -H "Content-Type: application/json" \\
  -d '{"password":"your-password"}' \\
  -o filename`
  
  const cliCommand = `sdrop download ${fileId} --password "your-password" --output filename`
  
  const handleCopy = async (command: string) => {
    await copyToClipboard(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-gray-800/90 backdrop-blur-lg border border-gray-700/30 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-white mb-4"
                >
                  Download using SSH
                </Dialog.Title>
                
                <div className="mb-4">
                  <p className="text-gray-300 text-sm">
                    You can download this file directly from your terminal using these commands:
                  </p>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b border-gray-700/50 mb-4">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'curl'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('curl')}
                  >
                    Using curl
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'cli'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('cli')}
                  >
                    Using SDROP CLI
                  </button>
                </div>
                
                {/* Tab content */}
                <div className="mb-6">
                  {activeTab === 'curl' ? (
                    <div>
                      <div className="relative">
                        <pre className="bg-gray-900/70 text-gray-300 p-3 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                          {curlCommand}
                        </pre>
                        <button
                          className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 p-1 rounded transition-colors"
                          onClick={() => handleCopy(curlCommand)}
                        >
                          {copied ? (
                            <svg className="w-5 h-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      <p className="mt-3 text-sm text-gray-400">
                        Replace <code className="text-primary">your-password</code> with the actual password and <code className="text-primary">filename</code> with your desired output filename.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300 text-sm mb-2">
                        First, install the SDROP CLI if you haven't already:
                      </p>
                      <pre className="bg-gray-900/70 text-gray-300 p-3 rounded-lg overflow-x-auto text-sm mb-4">
                        curl -sf https://sdrop.io/install.sh | sh
                      </pre>
                      
                      <p className="text-gray-300 text-sm mb-2">
                        Then, download the file:
                      </p>
                      <div className="relative">
                        <pre className="bg-gray-900/70 text-gray-300 p-3 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                          {cliCommand}
                        </pre>
                        <button
                          className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 p-1 rounded transition-colors"
                          onClick={() => handleCopy(cliCommand)}
                        >
                          {copied ? (
                            <svg className="w-5 h-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      <p className="mt-3 text-sm text-gray-400">
                        Replace <code className="text-primary">your-password</code> with the actual password and <code className="text-primary">filename</code> with your desired output filename.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <a
                    href="/docs"
                    className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-gray-900 hover:bg-primary/90 focus:outline-none"
                  >
                    Read Docs
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SshInstructionsModal