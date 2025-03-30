// src/components/ui/Button.tsx
import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  isLoading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  as?: React.ElementType
  href?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  as: Component = 'button',
  href,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none'
  
  // Size-specific classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-gray-900 hover:bg-primary/90 shadow-glow-primary',
    secondary: 'bg-gray-800/60 text-white hover:bg-gray-700/70 border border-gray-700/50',
    outline: 'bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white',
    ghost: 'bg-transparent hover:bg-gray-800/70 text-gray-300 hover:text-white',
    danger: 'bg-red-500/80 text-white hover:bg-red-600/90',
  }
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : ''
  
  // Disabled/loading classes
  const stateClasses = (disabled || isLoading) 
    ? 'opacity-70 cursor-not-allowed' 
    : 'transform hover:-translate-y-0.5 active:translate-y-0'
  
  // Icon spacing
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''
  
  // Combine all classes
  const allClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClasses}
    ${stateClasses}
    ${className}
  `
  
  // Button content
  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && <span className={iconSpacing}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={iconSpacing}>{icon}</span>}
    </>
  )
  
  // If using an 'a' tag, we don't want to pass the type attribute
  const buttonProps = Component === 'button' ? { 
    type, 
    disabled: disabled || isLoading, 
    ...props
  } : props
  
  // Use motion.button for animations
  return (
    <motion.div
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
    >
      <Component
        onClick={onClick}
        className={allClasses}
        href={href}
        {...buttonProps}
      >
        {content}
      </Component>
    </motion.div>
  )
}

export default Button