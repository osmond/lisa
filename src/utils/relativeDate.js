export function relativeDate(targetDate, baseDate = new Date(), timezone) {
  const toTz = d =>
    timezone
      ? new Date(new Date(d).toLocaleString('en-US', { timeZone: timezone }))
      : new Date(d)
  const target = toTz(targetDate)
  // Zero out time for accurate day comparison
  const base = toTz(baseDate)
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
