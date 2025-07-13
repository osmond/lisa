import { useRef } from 'react'

export default function useRipple() {
  const ref = useRef(null)

  const createRipple = e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const circle = document.createElement('span')
    const diameter = Math.max(rect.width, rect.height)
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`
    circle.className = 'ripple-effect'
    el.appendChild(circle)
    setTimeout(() => circle.remove(), 500)
  }

  return [ref, createRipple]
}
