// src/components/ui/Input.tsx
import React, { forwardRef, InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  variant?: 'default' | 'filled'
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  variant = 'default',
  containerClassName = '',
  className = '',
  ...props
}, ref) => {
  // Base classes
  const baseInputClasses = `
    w-full
    px-4
    py-3
    rounded-lg
    text-white
    placeholder-gray-500
    focus:outline-none
    focus:ring-2
    focus:ring-primary/50
    transition-all
    duration-200
    ${error ? 'border-red-500' : ''}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
  `
  
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-800/40 border border-gray-700/30 hover:border-gray-600/50',
    filled: 'bg-gray-900/90 border-2 border-transparent hover:bg-gray-900/80'
  }
  
  // Container classes
  const containerClasses = `
    ${fullWidth ? 'w-full' : 'inline-block'}
    ${containerClassName}
  `

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <input
            ref={ref}
            className={`
              ${baseInputClasses}
              ${variantClasses[variant]}
              ${className}
            `}
            {...props}
          />
        </motion.div>
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input