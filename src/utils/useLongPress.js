import { useRef } from 'react'

export default function useLongPress(callback, ms = 500) {
  const timer = useRef(null)

  const start = e => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => callback(e), ms)
  }

  const clear = () => {
    clearTimeout(timer.current)
    timer.current = null
  }

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
  }
}
