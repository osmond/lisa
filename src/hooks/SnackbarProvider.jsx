import { createContext, useContext, useState, useRef, useCallback } from 'react'

const SnackbarContext = createContext()

export function SnackbarProvider({ children, timeout = 5000 }) {
  const [snack, setSnack] = useState(null)
  const timer = useRef()

  const showSnackbar = useCallback((message, undoFn) => {
    clearTimeout(timer.current)
    setSnack({ message, undoFn })
    timer.current = setTimeout(() => setSnack(null), timeout)
  }, [timeout])

  const hideSnackbar = useCallback(() => {
    clearTimeout(timer.current)
    setSnack(null)
  }, [])

  return (
    <SnackbarContext.Provider value={{ snack, showSnackbar, hideSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  )
}

export const useSnackbarContext = () => useContext(SnackbarContext)

export function Snackbar() {
  const { snack, hideSnackbar } = useSnackbarContext()

  const handleUndo = () => {
    if (snack?.undoFn) snack.undoFn()
    hideSnackbar()
  }

  return snack ? (
    <div className="fixed inset-x-0 bottom-16 pb-safe flex justify-center pointer-events-none z-30">
      <div
        className="m-4 bg-accent text-white px-4 py-2 rounded shadow pointer-events-auto flex items-center gap-4"
        role="status"
      >
        <span>{snack.message}</span>
        {snack.undoFn && (
          <button onClick={handleUndo} className="underline text-sm">
            Undo
          </button>
        )}
      </div>
      <div aria-live="polite" className="sr-only">{snack.message}</div>
    </div>
  ) : null
}

export default SnackbarProvider
