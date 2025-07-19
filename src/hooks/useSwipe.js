import { useRef, useState } from 'react'

export default function useSwipe(onEnd, options = {}) {
  const startX = useRef(0)
  const [dx, setDx] = useState(0)
  const { threshold = 0 } = options

  const start = e => {
    startX.current = e?.clientX ?? e?.touches?.[0]?.clientX ?? 0
    if (e?.currentTarget?.setPointerCapture && e.pointerId != null) {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const move = e => {
    if (!startX.current) return
    const x = e?.clientX ?? e?.touches?.[0]?.clientX ?? 0
    setDx(x - startX.current)
  }

  const end = e => {
    const x = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? startX.current
    const diff = dx || (x - startX.current)
    if (Math.abs(diff) > threshold && typeof onEnd === 'function') {
      onEnd(diff)
    }
    setDx(0)
    startX.current = 0
    if (e?.currentTarget?.releasePointerCapture && e.pointerId != null) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return { dx, start, move, end }
}
