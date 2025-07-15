import { useState, useCallback } from 'react'

export default function useToast() {
  const [message, setMessage] = useState('')

  const showToast = useCallback(msg => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 800)
  }, [])

  const Toast = () =>
    message ? (
      <>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-8 h-8 text-green-600 check-pop"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div aria-live="polite" className="sr-only">{message}</div>
      </>
    ) : null

  return { Toast, showToast, message }
}
