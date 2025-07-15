import { useRef, useState } from 'react'

export function createRipple(e, target) {
  const el = target || e?.currentTarget
  if (!el) return
  const rect = el.getBoundingClientRect()
  const circle = document.createElement('span')
  const diameter = Math.max(rect.width, rect.height)
  let clientX = e?.touches?.[0]?.clientX ?? e?.clientX
  let clientY = e?.touches?.[0]?.clientY ?? e?.clientY
  if (clientX === undefined || clientY === undefined) {
    clientX = rect.left + rect.width / 2
    clientY = rect.top + rect.height / 2
  }
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${clientX - rect.left - diameter / 2}px`
  circle.style.top = `${clientY - rect.top - diameter / 2}px`
  circle.className = 'ripple-effect'
  el.appendChild(circle)
  setTimeout(() => circle.remove(), 500)
}

export function useSwipe(options = {}) {
  const { onEnd, ripple = false } = options
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)

  const down = e => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    if (ripple) createRipple(e)
  }

  const move = e => {
    if (!startX.current) return
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    setDeltaX(x - startX.current)
  }

  const end = e => {
    const x = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? startX.current
    const diff = deltaX || (x - startX.current)
    onEnd?.(diff)
    setDeltaX(0)
    startX.current = 0
  }

  const handlers = {
    onPointerDown: down,
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: end,
    onMouseDown: down,
    onMouseMove: move,
    onMouseUp: end,
    onTouchStart: down,
    onTouchMove: move,
    onTouchEnd: end,
  }

  return { deltaX, handlers }
}
