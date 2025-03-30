// src/hooks/useSshModal.ts
import { useState } from 'react'

/**
 * Custom hook to manage SSH instructions modal state
 */
export const useSshModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  
  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const toggleModal = () => setIsOpen(!isOpen)
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  }
}

export default useSshModal