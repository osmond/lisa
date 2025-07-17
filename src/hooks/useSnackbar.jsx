import { useCallback, useRef, useState } from 'react'

export default function useSnackbar(timeout = 5000) {
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

  const handleUndo = useCallback(() => {
    if (snack?.undoFn) snack.undoFn()
    hideSnackbar()
  }, [snack, hideSnackbar])

  const Snackbar = () =>
    snack ? (
      <div className="fixed inset-x-0 bottom-0 pb-safe flex justify-center pointer-events-none">
        <div
          className="m-4 bg-gray-800 text-white px-4 py-2 rounded shadow pointer-events-auto flex items-center gap-4"
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

  return { Snackbar, showSnackbar, hideSnackbar }
}
