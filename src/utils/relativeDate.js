export function relativeDate(targetDate, baseDate = new Date()) {
  const target = new Date(targetDate)
  // Zero out time for accurate day comparison
  const base = new Date(baseDate)
  target.setHours(0, 0, 0, 0)
  base.setHours(0, 0, 0, 0)
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = Math.round((target - base) / msPerDay)
  if (diff === 0) return 'today'
  if (diff === 1) return 'in 1 day'
  if (diff === -1) return '1 day ago'
  if (diff > 1) return `in ${diff} days`
  return `${Math.abs(diff)} days ago`
}
