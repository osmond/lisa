// createRipple is kept for components that rely on it via useRipple

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
