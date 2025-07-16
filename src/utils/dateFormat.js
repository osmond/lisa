import { daysAgo } from './date.js'

export function formatDaysAgo(dateStr, today = new Date()) {
  const diff = daysAgo(dateStr, today)
  if (diff == null) return ''
  const unit = diff === 1 ? 'day' : 'days'
  return `${diff} ${unit} ago`
}
