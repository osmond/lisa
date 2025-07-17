import { daysAgo } from './date.js'

export function formatDaysAgo(dateStr, today = new Date()) {
  const diff = daysAgo(dateStr, today)
  if (diff == null) return ''
  const unit = diff === 1 ? 'day' : 'days'
  return `${diff} ${unit} ago`
}

export function formatTimeOfDay(dateStr) {
  const d = new Date(dateStr)
  if (isNaN(d)) return ''
  const h = d.getHours()
  if (h < 12) return 'Morning'
  if (h < 18) return 'Afternoon'
  return 'Evening'
}
