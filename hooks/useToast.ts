import { useState, useRef, useCallback } from 'react'

const TOAST_DURATION = 3000

/**
 * Custom hook for managing toast notifications
 */
export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((message: string, duration = TOAST_DURATION) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    setToastMessage(message)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
    }, duration)
  }, [])

  const hideToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    setToastMessage(null)
  }, [])

  return { toastMessage, showToast, hideToast }
}
