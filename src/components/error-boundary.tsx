'use client'

import { useState, useEffect, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error: Error) => {
      setHasError(true)
      console.error("Uncaught error:", error)
    }

    // Attaching the global error handler
    window.addEventListener('error', (event) => handleError(event.error))
    
    return () => {
      // Cleanup the error listener
      window.removeEventListener('error', (event) => handleError(event.error))
    }
  }, [])

  if (hasError) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default ErrorBoundary
