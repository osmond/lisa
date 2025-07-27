export function formatMonth(key) {
  const [year, month] = key.split('-')
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${months[Number(month) - 1]} ${year}`
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export function daysAgo(dateStr, today = new Date()) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return null
  return Math.floor((today - d) / 86400000)
}

export function daysUntil(dateStr, today = new Date()) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return null
  return Math.ceil((d - today) / 86400000)
}

export function formatCareSummary(lastWatered, nextWater, today = new Date()) {
  const ago = daysAgo(lastWatered, today)
  const nextDate = nextWater ? new Date(nextWater) : null
  const until = nextDate ? Math.ceil((nextDate - today) / 86400000) : null

  const parts = []
  if (ago != null) {
    const unit = ago === 1 ? 'day' : 'days'
    parts.push(`Last watered ${ago} ${unit} ago`)
  }
  if (until != null) {
    let txt = ''
    if (until <= 0) txt = 'Needs water today'
    else if (until === 1) txt = 'Needs water tomorrow'
    else txt = `Needs water in ${until} days`
    parts.push(txt)
  }
  return parts.join(' \u00B7 ')
}

export function localIsoDate(date = new Date()) {
  const t = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return t.toISOString().slice(0, 10)
}
