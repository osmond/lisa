import { useEffect, useState } from 'react'

export default function SwipeTip() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const seen = localStorage.getItem('swipeTipSeen')
      if (!seen) setShow(true)
    }
  }, [])

  const hide = () => {
    setShow(false)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('swipeTipSeen', 'true')
    }
  }

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(hide, 5000)
    return () => clearTimeout(timer)
  }, [show])

  return show ? (
    <div className="fixed inset-x-0 bottom-20 pb-safe flex justify-center pointer-events-none z-30">
      <div
        role="status"
        className="px-3 py-2 bg-gray-800 text-white text-sm rounded shadow pointer-events-auto flex items-center gap-2"
      >
        <span>Swipe a task for more options</span>
        <button onClick={hide} className="underline text-xs">
          Got it
        </button>
      </div>
    </div>
  ) : null
}
